import { Game, GameCollection } from "/imports/api/collections/games";
import { FacingDir, Pos } from "/imports/core/interfaces";
import { facingDirToMove, normalizePosition, vectorSum } from "/imports/core/utils/geometry";
import { entities, entityTypes, items, spawnSpots } from "/imports/data/map";

const MONSTER_TICK_DIST = 20
const ITEM_LIFESPAN = 8

export class Simulation {
    game: Game
    now: Date

    constructor({ game, now }: {game: Game, now: Date}) {
        this.game = game
        this.now = now
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
                console.log('Moving: ', position, facingDir)
                return {
                    ...ent,
                    position,
                    facingDir: facingDir
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
                id: item.id + 10,
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