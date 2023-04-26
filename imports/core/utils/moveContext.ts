import { isAuthorized } from "../authorization"
import { GameStatus } from "../enums"
import { Game, GameCollection } from "/imports/api/collections/games"
import { Interaction, InteractionsCollection } from "/imports/api/collections/interactions"
import { Team, TeamsCollection } from "/imports/api/collections/teams"
import { GameCache, TeamCache } from "/imports/server/dbCache"
import { Random } from "meteor/random"

class MoveContext {

    isSimulation: boolean
    now: number
    gameCache: GameCache | undefined
    teamCache: TeamCache | undefined

    game: Game
    team: Team

    constructor(userId: string | null, gameCode: string, teamId: string, isSimulation: boolean) {
        this.isSimulation = isSimulation
        this.now = new Date().getTime()
        const cache = requireCache(isSimulation)
        this.gameCache = cache.gameCache
        this.teamCache = cache.teamCache
        this.game = checkGame(userId, gameCode, isSimulation, this.gameCache)
        this.team = getTeam(this.game._id, teamId, this.teamCache)
    }

    updateCache = (updatedTeam: Team) => {
        if(this.teamCache) {
            this.teamCache.set(updatedTeam._id, updatedTeam)
        }
    }

    delCache = () => {
        if(this.teamCache) {
            this.teamCache.del(this.team._id)
        }
    }
}

function checkGame(userId: string | null, gameCode: string, isSimulation: boolean, gameCache?: GameCache) {
    const game = gameCache ? gameCache.get(gameCode) : GameCollection.findOne({ code: gameCode })
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
    const team = teamCache ? teamCache.get(teamId) : TeamsCollection.findOne(teamId)
    if (!team || team.gameId !== gameId) {
        throw new Meteor.Error('moves.insert.noSuchTeam', 'Tým neexistuje.')
    }
    return team
}

function requireCache(isSimulation: boolean) {
    return isSimulation ? { gameCache: undefined, teamCache: undefined }
        : require('/imports/server/dbCache.ts') as { gameCache: GameCache, teamCache: TeamCache }
}

export { MoveContext }