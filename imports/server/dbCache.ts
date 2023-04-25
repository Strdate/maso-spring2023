import NodeCache from 'node-cache'
import { Game, GameCollection } from '/imports/api/collections/games'
import { Team, TeamsCollection } from '/imports/api/collections/teams'

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

    abstract find(id: string): T | undefined
}

class GameCache extends DbCache<Game> {
    constructor() {
        super({ stdTTL: 10, useClones: false })
    }

    find(id: string): Game | undefined {
        console.log('Retrieving Game from DB...')
        return GameCollection.findOne(id)
    }
}

class TeamCache extends DbCache<Team> {
    constructor() {
        super({ stdTTL: 20, useClones: false })
    }

    find(id: string): Team | undefined {
        console.log('Retrieving Team from DB...')
        return TeamsCollection.findOne(id)
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