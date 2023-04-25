import { MoveInput, InteractionsCollection } from "../api/collections/interactions";
import { Meteor } from 'meteor/meteor'
import { Team, TeamsCollection } from "../api/collections/teams";
import { FacingDir, MeteorMethodBase, Pos } from "./interfaces";
import { moveToFacingDir, normalizePosition, vectorDiff } from "./utils/geometry";
import { checkWallCollision } from "./utils/checkWallCollision";
import { checkCollision } from "./interaction";
import TeamQueryBuilder from "./utils/teamQueryBuilder";
import { checkGame, getTeam } from "./utils/moves";
import { isTeamFrozen, isTeamHunting } from "./utils/misc";
import { Promise } from 'meteor/promise';
import { Random } from 'meteor/random'

export default function insertMove({ gameId, teamId, newPos, userId, isSimulation }:
    MoveInput & MeteorMethodBase) {

    const { gameCache, teamCache } = isSimulation ?
        { gameCache: undefined, teamCache: undefined} : require('/imports/server/dbCache.ts')

    const now = new Date().getTime()
    const game = checkGame(userId, gameId, isSimulation, gameCache)
    const team = getTeam(gameId, teamId, teamCache)
    checkTeamState(team)
    const facingDir = checkPosition(team, newPos)
    newPos = normalizePosition(newPos)
    const teamQB = new TeamQueryBuilder()
    teamQB.qb.set({
        position: newPos,
        facingDir,
        // do not update if it didn't change
        state: isTeamHunting(team, now) ? 'HUNTING' : 'PLAYING',
        stateEndsAt: isTeamHunting(team, now) ? team.stateEndsAt : undefined
    })
    teamQB.qb.inc({ money: -1 })
    team.position = newPos
    const collisions = checkCollision(game, team, teamQB, now)
    if(team.state === 'HUNTING') {
        teamQB.qb.inc({ 'boostData.movesLeft': -1 })
    }
    if(!isSimulation) {
        const p1 = InteractionsCollection.rawCollection().insertOne({
            _id: Random.id(),
            gameId,
            teamId,
            newPos,
            userId: userId!,
            teamNumber: team.number,
            facingDir,
            moved: true,
            collisions: collisions,
            createdAt: new Date()
        })
        // @ts-ignore
        const p2 = TeamsCollection.rawCollection().updateOne({ _id: team._id }, teamQB.combine())
        Promise.await(Promise.all([p1, p2]))
        teamQB.updateCache(team)
    } else {
        TeamsCollection.update({ _id: team._id }, teamQB.combine())
    }
}

function checkPosition(team: Team, newPos: Pos): FacingDir {
    const facingDir = moveToFacingDir(vectorDiff(newPos, team.position))
    if(!facingDir) {
        throw new Meteor.Error('moves.insert.invalidPosition', 'Na tuto pozici se tým nemůže přesunout.')
    }
    if(!checkWallCollision(team.position, facingDir)) {
        throw new Meteor.Error('moves.insert.cantMoveToWall', 'V cestě překáží zeď.')
    }
    return facingDir
}

function checkTeamState(team: Team) {
    if(isTeamFrozen(team)) {
        throw new Meteor.Error('moves.insert.teamFrozen', 'Tým je momentálně zamrzlý.')
    }
    if(team.money <= 0) {
        throw new Meteor.Error('moves.insert.insufficientMoves', 'Nedostatek volných pohybů.')
    }
}