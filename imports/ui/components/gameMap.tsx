import { createEffect, onCleanup, onMount } from "solid-js";
import useResize from "../utils/useResize";
import RenderingEngine from "./RenderingEngine";
import { MoveInput } from "/imports/api/collections/moves";
import { IProjector } from "/imports/api/collections/projectors";
import { Team } from "/imports/api/collections/teams";
import { EntityInstance, FacingDir } from "/imports/core/interfaces";
import { facingDirToMove, vectorSum } from "/imports/core/utils/geometry";
import insertMove from "/imports/api/methods/moves/insert"

type Props = {
    projector: IProjector
    team?: Team
}

export default function GameMap(props: Props) {
    let re: RenderingEngine;
    console.log('GameMap mounted!')
    const innerSize = useResize()
    onMount(() => {
        const canvas = document.getElementById("game-map") as HTMLCanvasElement
        canvas.addEventListener("keydown", handleKeyDown)
        re = new RenderingEngine(canvas)
    })
    onCleanup(() => {
        const canvas = document.getElementById("game-map") as HTMLCanvasElement
        canvas.removeEventListener("keydown", handleKeyDown)
        console.log('GameMap dismounted!')
    });
    createEffect(() => {
        innerSize() // trigger dependency
        re.render(transformEntities(props.projector.entities, props.team))
    })

    const handleKeyDown = (event: KeyboardEvent) => {
        if(!props.team) {
            return
        }
        event.preventDefault()
        const facingDir = keyToFacingDir(event.code)
        if(facingDir) {
            const input: MoveInput = {
                gameId: props.projector.gameId,
                teamId: props.team._id,
                newPos: vectorSum(props.team.position, facingDirToMove(facingDir))
            }
            insertMove.call(input, moveCallback)
        }
    }

    const moveCallback = (error: any, result: any) => {
        if(error) {
            console.log(error)
        }
    }

  return <canvas tabIndex='0' id="game-map" width='300px' height='300px' ></canvas>
}

function transformEntities(entities: EntityInstance[], team?: Team) {
    // Yes, team is sometimes empty object :O
    if(!team || !team.position) {
        return entities
    }
    entities = [...entities]

    // Add pacman sprite
    entities.push({
        id: 0,
        category: 'PACMAN',
        spriteMapOffset: [0, 2],
        position: team.position,
        facingDir: team.facingDir
    })

    return entities
}

function keyToFacingDir(code: string): FacingDir | undefined {
    switch(code) {
        case 'ArrowUp':
        case 'KeyW':
            return 'UP'
        case 'ArrowDown':
        case 'KeyS':
            return 'DOWN'
        case 'ArrowRight':
        case 'KeyD':
            return 'RIGHT'
        case 'ArrowLeft':
        case 'KeyA':
            return 'LEFT'
    }
}