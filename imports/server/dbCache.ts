import NodeCache from 'node-cache'
import { Game, GameCollection } from '/imports/api/collections/games'
import { Team, TeamsCollection } from '/imports/api/collections/teams'
import { getServerConfig } from './config';

abstract class DbCache<T> {
    #cache;
    constructor(options: NodeCache.Options) {
        this.#cache = new NodeCache(options)
    }

    get(id: string) {
        let result: T | undefined = this.#cache.get(id)
        if(!result) {
            result = this.find(id)
            if(result) {
                this.#cache.set(id, result)
            }
        }
        return result
    }

    del(id: string) {
        this.#cache.del(id)
    }

    set(id: string, obj: T) {
        this.#cache.set(id, obj)
    }

    rawCache() {
        return this.#cache
    }

    abstract find(id: string): T | undefined
}

class GameCache extends DbCache<Game> {
    constructor() {
        super({ stdTTL: 10, useClones: false })
    }

    get(id: string) {
        if(getServerConfig().disableGameCache) {
            return GameCollection.findOne({ code: id })
        }
        return super.get(id)
    }

    find(id: string): Game | undefined {
        console.log('Retrieving Game from DB...')
        return GameCollection.findOne({ code: id })
    }

    beginObserving() {
        GameCollection.find({}).observe({
            changed(game) {
                console.log(`Observed change of game '${game.code}'`)
                gameCache.set(game.code, game)
            },
            removed(game) {
                gameCache.del(game.code)
            }
        })
    }
}

class TeamCache {
    #cache;
    constructor() {
        this.#cache = new NodeCache({ stdTTL: 10, useClones: false })
    }

    get(teamNumber: string, gameId: string) {
        if(getServerConfig().disableTeamCache) {
            return TeamsCollection.findOne({ number: teamNumber, gameId })
        }
        const cacheKey = `_${teamNumber}_${gameId}`
        let result: Team | undefined = this.#cache.get(cacheKey)
        if(!result) {
            result = TeamsCollection.findOne({ number: teamNumber, gameId })
            if(result) {
                this.#cache.set(cacheKey, result)
            }
        }
        return result
    }

    del(teamNumber: string, gameId: string) {
        this.#cache.del(`_${teamNumber}_${gameId}`)
    }

    set(obj: Team, gameId: string) {
        this.#cache.set(`_${obj.number}_${gameId}`, obj)
    }
}

const gameCache = new GameCache()
const teamCache = new TeamCache()

export {
    gameCache,
    teamCache,
    GameCache,
    TeamCache
}