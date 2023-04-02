import { isAuthorized } from "../authorization"
import { GameStatus } from "../enums"
import { GameCollection } from "/imports/api/collections/games"
import { TeamsCollection } from "/imports/api/collections/teams"

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

export { checkGame, getTeam }