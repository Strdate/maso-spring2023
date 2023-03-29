import { Game } from "/imports/api/collections/games";
import { IProjector, ProjectorCollection } from "/imports/api/collections/projectors";
import { FacingDir, Pos } from "/imports/core/interfaces";
import { facingDirToMove, normalizePosition, vectorSum } from "/imports/core/utils/geometry";
import { entities } from "/imports/data/map";

const MONSTER_TICK_DIST = 20

export class Simulation {
    game: Game
    projector: IProjector
    now: Date

    constructor({ game, now }: {game: Game, now: Date}) {
        this.game = game
        this.projector = ProjectorCollection.findOne({ code: game.code })!
        this.now = now
    }

    moveMonsters = () => {
        const tick = this.getCurMonsterTick()
        console.log(`Moving monsters. Tick: ${tick}`)
        this.projector.entities = this.projector.entities.map(ent => {
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

    saveEntities = () => {
        ProjectorCollection.update(this.projector._id!,{
            $set: { entities: this.projector.entities },
        })
    }

    getCurMonsterTick = () => {
        return (this.now.getTime() - this.projector.startAt.getTime()) / 1000 / MONSTER_TICK_DIST
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