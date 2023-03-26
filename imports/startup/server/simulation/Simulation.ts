import { Game } from "/imports/api/collections/games";
import { IProjector, ProjectorCollection } from "/imports/api/collections/projectors";
import { FacingDir } from "/imports/core/interfaces";
import { entities, pacmanMap } from "/imports/data/map";

const MONSTER_TICK_DIST = 1

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
    let agg: [number, number] = [0, 0]
    const modTick = tick % program.length
    for(let i = 0; i <= modTick; i++) {
        agg = vectorSum(agg, facingDirToMove(program[i]))
    }
    return agg
}

function facingDirToMove(facingDir: FacingDir): [number, number] {
    switch (facingDir) {
        case 'UP': return [0,-1]
        case 'DOWN': return [0,1]
        case 'LEFT': return [-1,0]
        case 'RIGHT': return [1,0]
    }
}

function vectorSum(a: [number, number], b: [number, number]): [number, number] {
    return [a[0] + b[0], a[1] + b[1]]
}

function normalizePosition(pos: [number, number]): [number, number] {
    return [((pos[0] - 1) % pacmanMap[0].length) + 1, ((pos[1] - 1) % pacmanMap.length) + 1]
}