import { MoveInput, MovesCollection } from "../api/collections/moves";
import { Meteor } from 'meteor/meteor'
import { GameCollection } from "../api/collections/games";
import { isAuthorized } from "./authorization";
import { GameStatus } from "./enums";
import { Team, TeamsCollection } from "../api/collections/teams";
import { FacingDir } from "./interfaces";
import { moveToFacingDir, vectorDiff } from "./utils/geometry";

interface MoveInputUser extends MoveInput {
    userId: string | null
}

export default function insertMove({ gameId, teamId, newPos, userId }: MoveInputUser) {
    const game = getGame(userId, gameId)
    const team = getTeam(game._id, teamId)
    const facingDir = checkPosition(team, newPos)
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
    TeamsCollection.update(team._id, {
        $set: {
            position: newPos,
            facingDir
        }
    })
}

function checkPosition(team: Team, newPos: [number, number]): FacingDir {
    const facingDir = moveToFacingDir(vectorDiff(newPos, team.position))
    if(!facingDir) {
        throw new Meteor.Error('moves.insert.invalidPosition', 'Na tuto pozici se tým nemůže přesunout.')
    }
    return facingDir
}

function getGame(userId: string | null, gameId: string) {
    const game = GameCollection.findOne(gameId)
    if (!game || !isAuthorized(userId, game)) {
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