import { isAuthorized } from "../authorization"
import { GameStatus } from "../enums"
import { Game, GameCollection } from "/imports/api/collections/games"
import { Task, TasksCollection } from "/imports/api/collections/tasks"
import { Team, TeamsCollection } from "/imports/api/collections/teams"
import { GameCache, TeamCache } from "/imports/server/dbCache"

class MoveContext {

    isSimulation: boolean
    now: number
    gameCache: GameCache | undefined
    teamCache: TeamCache | undefined

    game: Game
    team: Team
    userId: string | null

    constructor(userId: string | null, gameCode: string, teamNumber: string, isSimulation: boolean) {
        this.isSimulation = isSimulation
        this.now = new Date().getTime()
        const cache = requireCache(isSimulation)
        this.gameCache = cache.gameCache
        this.teamCache = cache.teamCache
        this.game = checkGame(userId, gameCode, isSimulation, this.gameCache)
        this.team = getTeam(this.game._id, teamNumber, this.teamCache)
        this.userId = userId
    }

    updateCache = (updatedTeam: Team | undefined) => {
        if(this.teamCache && updatedTeam) {
            this.teamCache.set(updatedTeam, this.game._id)
        }
    }

    delCache = () => {
        if(this.teamCache) {
            this.teamCache.del(this.team.number, this.game._id)
        }
    }

    measurePerf = (method: string) => {
        console.log(`Method ${method}, team: ${this.team.number}, performance ${new Date().getTime() - this.now} ms`)
    }
}

class TaskContext extends MoveContext {
    tasks: Task[]
    constructor(userId: string | null, gameCode: string, teamNumber: string) {
        super(userId, gameCode, teamNumber, false)
        this.tasks = TasksCollection.find({
            gameId: this.game._id,
            teamId: this.team._id,
            isRevoked: false,
        }, { sort: { number: 1 } }).fetch()
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

function getTeam(gameId: string, teamNumber: string, teamCache?: TeamCache) {
    const team = teamCache ? teamCache.get(teamNumber, gameId) : TeamsCollection.findOne({ number: teamNumber, gameId })
    if (!team || team.gameId !== gameId) {
        throw new Meteor.Error('moves.insert.noSuchTeam', 'Tým neexistuje.')
    }
    return team
}

function requireCache(isSimulation: boolean) {
    return isSimulation ? { gameCache: undefined, teamCache: undefined }
        : require('/imports/server/dbCache.ts') as { gameCache: GameCache, teamCache: TeamCache }
}

export { MoveContext, TaskContext }