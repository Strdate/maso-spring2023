import { InteractionsCollection, MoveInput } from "../api/collections/interactions";
import { Meteor } from 'meteor/meteor'
import { Team, TeamsCollection } from "../api/collections/teams";
import { FacingDir, MeteorMethodBase, Pos } from "./interfaces";
import { moveToFacingDir, normalizePosition, vectorDiff } from "./utils/geometry";
import { checkWallCollision } from "./utils/checkWallCollision";
import { checkCollision } from "./interaction";
import TeamQueryBuilder from "./utils/teamQueryBuilder";
import { isTeamFrozen, isTeamHunting } from "./utils/misc";
import { MoveContext } from "./utils/moveContext";

export default function insertMove({ gameCode, teamId, newPos, userId, isSimulation }:
    MoveInput & MeteorMethodBase) {

    const context = new MoveContext(userId, gameCode, teamId, isSimulation)
    const team = context.team
    const game = context.game

    checkTeamState(team)
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
        team.boostData.movesLeft += -1
    }

    if(!isSimulation) {
        InteractionsCollection.insert({
            gameId: game._id,
            gameCode: gameCode,
            teamId,
            newPos,
            userId: userId!,
            teamNumber: team.number,
            teamState: col.frozen ? 'FROZEN' : newState,
            facingDir,
            moved: true,
            collisions: col.collisions,
            createdAt: new Date()
        }, () => { })
    }
    TeamsCollection.update(team._id, teamQB.combine(), {}, () => { })
    teamQB.applyUpdate(team)
    context.updateCache(team)
    console.log('Move finished')
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