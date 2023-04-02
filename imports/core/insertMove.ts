import { MoveInput, InteractionsCollection } from "../api/collections/interactions";
import { Meteor } from 'meteor/meteor'
import { Team, TeamsCollection } from "../api/collections/teams";
import { FacingDir, MeteorMethodBase, Pos } from "./interfaces";
import { moveToFacingDir, normalizePosition, vectorDiff } from "./utils/geometry";
import { checkWallCollision } from "./utils/checkWallCollision";
import { checkCollision } from "./interaction";
import TeamQueryBuilder from "./utils/teamQueryBuilder";
import { checkGame, getTeam } from "./utils/moves";
import { isTeamHunting } from "./utils/misc";

export default function insertMove({ gameId, teamId, newPos, userId, isSimulation }:
    MoveInput & MeteorMethodBase) {

    const now = new Date().getTime()
    const game = checkGame(userId, gameId, isSimulation)
    const team = getTeam(gameId, teamId)
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
        InteractionsCollection.insert({
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
    }
    TeamsCollection.update(team._id, teamQB.combine())
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
    if(team.state === 'FROZEN' && team.stateEndsAt && team.stateEndsAt.getTime() > new Date().getTime()) {
        throw new Meteor.Error('moves.insert.teamFrozen', 'Tým je momentálně zamrzlý.')
    }
    if(team.money <= 0) {
        throw new Meteor.Error('moves.insert.insufficientMoves', 'Nedostatek volných pohybů.')
    }
}