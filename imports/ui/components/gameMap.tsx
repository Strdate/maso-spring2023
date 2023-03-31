import { createEffect, onCleanup, onMount } from "solid-js";
import useResize from "../utils/useResize";
import RenderingEngine from "./RenderingEngine";
import { MoveInput } from "/imports/api/collections/moves";
import { Team } from "/imports/api/collections/teams";
import { EntityInstance, FacingDir } from "/imports/core/interfaces";
import { facingDirToMove, vectorSum } from "/imports/core/utils/geometry";
import insertMove from "/imports/api/methods/moves/insert"
import { Game } from "/imports/api/collections/games";

type Props = {
    game: Game
    team?: Team
}

export default function GameMap(props: Props) {
    let re: RenderingEngine
    let canvasRef: any
    console.log('GameMap mounted!')
    const innerSize = useResize()
    onMount(() => {
        window.addEventListener("keydown", handleKeyDown)
        re = new RenderingEngine(canvasRef)
    })
    onCleanup(() => {
        //const canvas = document.getElementById("game-map") as HTMLCanvasElement
        window.removeEventListener("keydown", handleKeyDown)
        console.log('GameMap dismounted!')
    });
    createEffect(() => {
        innerSize() // trigger dependency
        re.render(transformEntities(props.game.entities, props.team))
    })

    const handleKeyDown = (event: KeyboardEvent) => {
        if(!props.team) {
            return
        }
        if(document.getElementById('teamInput') === document.activeElement) {
            return
        }
        const facingDir = keyToFacingDir(event.code)
        if(facingDir) {
            const input: MoveInput = {
                gameId: props.game._id,
                teamId: props.team._id,
                newPos: vectorSum(props.team.position, facingDirToMove(facingDir))
            }
            event.preventDefault()
            insertMove.call(input, moveCallback)
        }
    }

    const moveCallback = (error: any/*, result: any*/) => {
        if(error) {
            console.log(error)
        }
    }

  return <canvas ref={canvasRef} tabIndex='0' id="game-map" width='300px' height='300px' ></canvas>
}

function transformEntities(entities: EntityInstance[], team?: Team) {
    // Yes, team is sometimes empty object :O
    if(!team || !team.position) {
        return entities
    }
    entities = [...entities]

    // Remove picked up items
    entities = entities.filter(ent => ent.category !== 'ITEM' || !team.pickedUpEntities.includes(ent.id) )

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