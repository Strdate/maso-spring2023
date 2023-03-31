import { MoveInput, MovesCollection } from "../api/collections/moves";
import { Meteor } from 'meteor/meteor'
import { Game, GameCollection } from "../api/collections/games";
import { isAuthorized } from "./authorization";
import { GameStatus } from "./enums";
import { Team, TeamsCollection } from "../api/collections/teams";
import { FacingDir, Pos } from "./interfaces";
import { moveToFacingDir, normalizePosition, vectorDiff, vectorEq } from "./utils/geometry";
import checkWallCollision from "./utils/checkWallCollision";
import { collide } from "./interaction";
import TeamQueryBuilder from "./utils/teamQueryBuilder";

export default function insertMove({ gameId, teamId, newPos, userId, isSimulation }:
    MoveInput & {isSimulation: boolean, userId: string | null}) {

    const game = checkGame(userId, gameId, isSimulation)
    const team = getTeam(gameId, teamId)
    const facingDir = checkPosition(team, newPos)
    newPos = normalizePosition(newPos)
    const teamQB = new TeamQueryBuilder()
    checkCollision(game, team, newPos, teamQB)
    if(!isSimulation) {
        MovesCollection.insert({
            gameId,
            teamId,
            newPos,
            userId: userId!,
            teamNumber: team.number,
            isRevoked: false,
            facingDir,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }
    teamQB.qb.set({
        position: newPos,
        facingDir
    })
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

function checkGame(userId: string | null, gameId: string, isSimulation: boolean) {
    const game = GameCollection.findOne(gameId)
    if (!game || (!isAuthorized(userId, game) && !isSimulation)) {
      throw new Meteor.Error('moves.insert.insertNotAllowed', 'Nemáte pro tuto hru dostatečná oprávnění.')
    }
    const now = new Date().setMilliseconds(0)
    if (new Date(game.startAt).getTime() > now) {
      throw new Meteor.Error('moves.insert.notRunning', 'Hra ještě nezačala.')
    }
    if (new Date(game.endAt).getTime() + 1000000 <= now) {
      throw new Meteor.Error('moves.insert.notRunning', 'Hra už skončila.')
    }
    if((game.statusId != GameStatus.Running) && (game.statusId != GameStatus.OutOfTime)) {
      throw new Meteor.Error('moves.insert.notRunning', 'Hra nebyla zahájena nebo už skončila.')
    }
    return game
}

function getTeam(gameId: string, teamId: string) {
    const team = TeamsCollection.findOne({ _id: teamId, gameId })
    if (!team) {
        throw new Meteor.Error('moves.insert.noSuchTeam', 'Tým neexistuje.')
    }
    return team
}

function checkCollision(game: Game, team: Team, newPos: Pos, teamQB: TeamQueryBuilder) {
    game.entities.forEach(ent => {
        if(vectorEq(newPos,ent.position)) {
            if(!collide(team, ent, teamQB)) {
                return
            }
        }
    })
}