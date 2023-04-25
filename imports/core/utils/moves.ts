import { isAuthorized } from "../authorization"
import { GameStatus } from "../enums"
import { TeamsCollection } from "/imports/api/collections/teams"
import {InteractionsCollection} from "/imports/api/collections/interactions";
import { GameCollection } from "/imports/api/collections/games";
import { GameCache, TeamCache } from "/imports/server/dbCache";

function checkGame(userId: string | null, gameId: string, isSimulation: boolean, gameCache?: GameCache) {
    const game = gameCache ? gameCache.get(gameId) : GameCollection.findOne(gameId)
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

function getTeam(gameId: string, teamId: string, teamCache?: TeamCache) {
    const team = teamCache ? teamCache.get(teamId) : (console.log('Finding team in DB'), TeamsCollection.findOne(teamId))
    if (!team || team.gameId !== gameId) {
        throw new Meteor.Error('moves.insert.noSuchTeam', 'Tým neexistuje.')
    }
    return team
}

function getLastInteractions(gameId: string, teamId: string) {
  console.log("getLastInteractions", gameId, teamId)
  const lastInteraction = InteractionsCollection.findOne({gameId, teamId, reverted: { $ne: true } },
    { sort: { createdAt: -1 } });
  const moves = InteractionsCollection.find({gameId, teamId, reverted: { $ne: true }, moved: true},
    { sort: { createdAt: -1 }, limit: 2 }).fetch();
  return [lastInteraction, moves[0] || undefined, moves[1] || moves[0] || undefined];
}

export { checkGame, getTeam, getLastInteractions }
