import { InteractionsCollection, MoveInput } from "../api/collections/interactions";
import { Meteor } from 'meteor/meteor'
import { Team, TeamsCollection } from "../api/collections/teams";
import { FacingDir, MeteorMethodBase, Pos } from "./interfaces";
import { moveToFacingDir, normalizePosition, vectorDiff } from "./utils/geometry";
import { checkWallCollision } from "./utils/checkWallCollision";
import { checkCollision } from "./interaction";
import TeamQueryBuilder from "./utils/teamQueryBuilder";
import { errorCallback, isTeamFrozen, isTeamHunting } from "./utils/misc";
import { MoveContext } from "./utils/moveContext";
import modify from 'modifyjs'
import { Game } from "../api/collections/games";

export default function insertMove({ gameCode, teamNumber, newPos, userId, isSimulation }:
    MoveInput & MeteorMethodBase) {

    const context = new MoveContext(userId, gameCode, teamNumber, isSimulation)
    const team = context.team
    const game = context.game

    checkTeamState(game, team)
    const facingDir = checkPosition(team, newPos)
    newPos = normalizePosition(newPos)
    team.position = newPos

    const teamQB = new TeamQueryBuilder()
    teamQB.qb.set({
        position: newPos,
        facingDir
    })

    const newState = isTeamHunting(team, context.now) ? 'HUNTING' : 'PLAYING'
    if(newState !== team.state) {
        teamQB.qb.set({
            state: newState,
            stateEndsAt: newState === 'HUNTING' ? team.stateEndsAt : undefined
        })
    }
    teamQB.qb.inc({ money: -1 })

    const col = checkCollision(game, team, teamQB, context.now)
    if(newState === 'HUNTING') {
        teamQB.qb.inc({ 'boostData.movesLeft': -1 })
    }

    if(!isSimulation) {
        InteractionsCollection.insert({
            gameId: game._id,
            gameCode: gameCode,
            teamId: team._id,
            newPos,
            userId: userId!,
            teamNumber: team.number,
            teamState: col.frozen ? 'FROZEN' : newState,
            facingDir,
            moved: true,
            collisions: col.collisions,
            createdAt: new Date()
        }, errorCallback)
    }
    const query = teamQB.combine()
    TeamsCollection.update(team._id, query/*, {},(error: any, id: any) => {
        context.measurePerf('insertMove')
        errorCallback(error, id)
    }*/)
    const updated = modify(team, query)
    context.updateCache(updated)
    if(isSimulation) {
        console.log('Insert move finished on client')
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

function checkTeamState(game: Game, team: Team) {
    if(isTeamFrozen(game, team)) {
        throw new Meteor.Error('moves.insert.teamFrozen', 'Tým je momentálně zamrzlý.')
    }
    if(team.money <= 0) {
        throw new Meteor.Error('moves.insert.insufficientMoves', 'Nedostatek volných pohybů.')
    }
}