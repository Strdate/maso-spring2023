import { doSimpleMove, graphSearch } from "./monsterUtils";
import { Game, GameCollection } from "/imports/api/collections/games";
import { TeamsCollection, Team } from "/imports/api/collections/teams";
import { FacingDir, Pos } from "/imports/core/interfaces";
import { facingDirToMove, normalizePosition, vectorSum } from "/imports/core/utils/geometry";
import { entities, entityTypes, items, pacmanMap, spawnSpots } from "/imports/data/map";

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
            position: 1,
            state: 1,
        stateEndsAt: 1 }}).fetch()
    }

    moveMonsters = () => {
        const tick = this.getCurMonsterTick()
        console.log(`Moving monsters. Tick: ${tick}`)
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
            } else if(ent.id === 5) {
                const move = doSimpleMove(ent)
                if(!move.newFacingDir) {
                    move.newFacingDir = graphSearch(this.getMapState(), move.newPos, ent.position)
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
    }

    spawnItems = () => {
        const minute = this.getCurMinute()
        this.game.entities = this.game.entities.filter(ent => ent.category !== 'ITEM')
        items.filter(item => item.spawnTime <= minute && minute - item.spawnTime < ITEM_LIFESPAN).forEach(item => {
            const type = entityTypes.find(et => et.typeId === item.type)!
            this.game.entities.push({
                id: item.id,
                category: 'ITEM',
                spriteMapOffset: type.spriteMapOffset,
                position: spawnSpots.find(ss => ss.id === item.spawnSpotId)!.position
            })
        })
    }

    saveEntities = () => {
        GameCollection.update(this.game._id, {
            $set: { entities: this.game.entities },
        })
    }

    getMapState = () => {
        if(!this.mapState) {
            this.mapState = aggregateMapState(this.teams)
        }
        return this.mapState
    }

    getCurMonsterTick = () => {
        return (this.now.getTime() - this.game.startAt.getTime()) / 1000 / MONSTER_TICK_DIST
    }

    getCurMinute = () => {
        return (this.now.getTime() - this.game.startAt.getTime()) / 1000 / 60
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
    const arr: number[][] = new Array(pacmanMap.length)
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(pacmanMap[0].length).fill(0)
    }
    for(let i = 0; i < teams.length; i++) {
        const team = teams[i]
        if(team.state === 'PLAYING' || team.state === 'HUNTING') {
            arr[team.position[1]-1][team.position[0]-1] += 1
        }
    }
    return arr
}