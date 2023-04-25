import { doSimpleMove, graphSearch, monsterGraphSearch } from "./monsterUtils";
import { Game, GameCollection } from "/imports/api/collections/games";
import { InteractionsCollection } from "/imports/api/collections/interactions";
import { TeamsCollection, Team } from "/imports/api/collections/teams";
import { FacingDir, Pos } from "/imports/core/interfaces";
import { facingDirToMove, normalizePosition, vectorSum } from "/imports/core/utils/geometry";
import TeamQueryBuilder from "/imports/core/utils/teamQueryBuilder";
import { ItemsData, entities, entityTypes, items, pacmanMap, spawnSpots } from "/imports/data/map";
import { checkCollision } from "/imports/core/interaction";
import { Random } from 'meteor/random'
import { gameCache, teamCache } from "/imports/server/dbCache";
import { Promise } from 'meteor/promise';

const MONSTER_TICK_DIST = 20
const ITEM_LIFESPAN = 8

export class Simulation {
    game: Game
    now: Date
    teams: Team[]
    mapState: number[][] | undefined

    constructor({ game, now }: {game: Game, now: Date}) {
        this.game = game
        this.now = now
        this.teams = TeamsCollection.find({ gameId: game._id }, { fields: {
            _id: 1,
            number: 1,
            position: 1,
            state: 1,
            stateEndsAt: 1,
            pickedUpEntities: 1,
            boostData: 1
        }}).fetch()
    }

    checkCollisions = (now: number) => {
        const teamBulk = TeamsCollection.rawCollection().initializeUnorderedBulkOp()
        const interactionsBulk = InteractionsCollection.rawCollection().initializeUnorderedBulkOp()
        const invalidate: string[] = []
        this.teams.forEach((team) => {
            if(team.state !== 'PLAYING' && team.state !== 'HUNTING') {
                return
            }
            const teamQB = new TeamQueryBuilder()
            const collisions = checkCollision(this.game, team, teamQB, now)
            if(collisions.length > 0) {
                teamBulk.find({ _id: team._id }).update(teamQB.combine())
                interactionsBulk.insert({
                    _id: Random.id(),
                    gameId: this.game._id,
                    teamId: team._id,
                    newPos: team.position,
                    userId: 'robotworkeruserid',
                    teamNumber: team.number,
                    moved: false,
                    collisions: collisions,
                    createdAt: new Date()
                })
                invalidate.push(team._id)
                //console.log(`Collision with team ${team.number}, query: `,teamQB.combine())
            }
        })
        if(teamBulk.length > 0) {
            Promise.await(Promise.all([
                teamBulk.execute(),
                interactionsBulk.execute()
            ]))
            invalidate.forEach((id) => {
                teamCache.del(id)
            })
        }
    }

    moveMonsters = (): boolean => {
        const tick = this.getCurMonsterTick()
        console.log(`Moving monsters. Tick: ${tick}`)
        if(tick < 0) {
            return false
        }
        this.game.entities = this.game.entities.map(ent => {
            if(ent.category !== 'MONSTER') {
                return ent
            }
            const data = entities.find(entData => entData.id === ent.id)!
            if(data.program) {
                const facingDir = data.program[(tick + 1) % data.program.length]
                const position = normalizePosition(vectorSum(aggregatePosition(data.program, tick), data.startPos))
                return {
                    ...ent,
                    position,
                    facingDir: facingDir
                }
            } else if(ent.id === 5 || ent.id === 6) {
                const move = doSimpleMove(ent)
                if(!move.newFacingDir) {
                    if(ent.id === 5) {
                        move.newFacingDir = graphSearch(this.getMapState(), move.newPos, ent.position)
                    } else {
                        move.newFacingDir = monsterGraphSearch(aggregateMonsterMapState(this.game), move.newPos, ent.position)
                    }
                }
                console.log('Moving to: ',move.newFacingDir,move.newPos)
                return {
                    ...ent,
                    position: move.newPos,
                    facingDir: move.newFacingDir ?? 'RIGHT'
                }
            }
            return ent
        })
        return true
    }

    spawnItems = () => {
        const minute = this.getCurMinute()
        if(minute < 0) {
            return
        }
        this.game.entities = this.game.entities.filter(ent => ent.category !== 'ITEM')
        items.filter(item => isItemVisible(item, this.game, minute)).forEach(item => {
            const type = entityTypes.find(et => et.typeId === item.type)!
            this.game.entities.push({
                id: item.id,
                category: 'ITEM',
                spriteMapOffset: type.spriteMapOffset,
                position: spawnSpots.find(ss => ss.letter === item.spawnSpot)!.position,
                healthIndicator: getHelathState(item.spawnTime, minute),
                flashing: getHelathState(item.spawnTime, minute) === 3
            })
        })
    }

    saveEntities = () => {
        GameCollection.update(this.game._id, {
            $set: { entities: this.game.entities },
        })
        gameCache.del(this.game.code)
    }

    getMapState = () => {
        if(!this.mapState) {
            this.mapState = aggregateMapState(this.teams)
        }
        return this.mapState
    }

    getCurMonsterTick = () => {
        return (this.now.getTime() - this.game.startAt.getTime() - this.game.freezeTimeMins * 60 * 1000) / 1000 / MONSTER_TICK_DIST
    }

    getCurMinute = () => {
        return (this.now.getTime() - this.game.startAt.getTime()) / 1000 / 60 - this.game.freezeTimeMins
    }
}

function isItemVisible(item: ItemsData, game: Game, minute: number) {
    return item.spawnTime <= minute && minute - item.spawnTime < ITEM_LIFESPAN
}

function getHelathState(spawnTime: number, minute: number) {
    const timeLeft = spawnTime + ITEM_LIFESPAN - minute
    //console.log('Time left:',timeLeft)
    switch(timeLeft) {
        case 1: return 3
        case 2: return 2
        case 3: return 1
        case 4: return 0
        default: return undefined
    }
}

function aggregatePosition(program: FacingDir[], tick: number) {
    let agg: Pos = [0, 0]
    const modTick = tick % program.length
    for(let i = 0; i <= modTick; i++) {
        agg = vectorSum(agg, facingDirToMove(program[i]))
    }
    return agg
}

function aggregateMapState(teams: Team[]) {
    const arr = getMapArray()
    for(let i = 0; i < teams.length; i++) {
        const team = teams[i]
        if(team.state === 'PLAYING' || team.state === 'HUNTING') {
            arr[team.position[1]-1][team.position[0]-1] += 1
        }
    }
    return arr
}

function aggregateMonsterMapState(game: Game) {
    const arr = getMapArray()
    game.entities.filter(ent => ent.category === 'MONSTER' && ent.id !== 6).forEach(ent => {
        arr[ent.position[1]-1][ent.position[0]-1] += 1
    })
    return arr
}

function getMapArray() {
    const arr: number[][] = new Array(pacmanMap.length)
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(pacmanMap[0].length).fill(0)
    }
    return arr
}