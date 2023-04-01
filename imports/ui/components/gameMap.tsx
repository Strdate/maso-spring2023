import { createEffect, onCleanup, onMount } from "solid-js";
import useResize from "../utils/useResize";
import RenderingEngine from "./RenderingEngine";
import { MoveInput } from "../../api/collections/interactions";
import { Team } from "/imports/api/collections/teams";
import { EntityInstance, FacingDir } from "/imports/core/interfaces";
import { facingDirToMove, vectorSum } from "/imports/core/utils/geometry";
import insertMove from "/imports/api/methods/moves/insert"
import { Game } from "/imports/api/collections/games";
import { entities, entityTypes, items } from "/imports/data/map";
import { GameStatus } from "/imports/core/enums";
import { resetMovesLeft } from "../utils/utils";

type Props = {
    game: Game
    team?: Team
    inputPage?: boolean
    movesLeft?: number
    setMovesLeft?: (moves: number) => void
}

export default function GameMap(props: Props) {
    let re: RenderingEngine
    let canvasRef: any
    let flash = false
    console.log('GameMap mounted!')
    const innerSize = useResize()
    onMount(() => {
        window.addEventListener("keydown", handleKeyDown)
        re = new RenderingEngine(canvasRef, props.inputPage)
    })
    let timer: NodeJS.Timer
    if(props.inputPage) {
        timer = setInterval(() => {
            flash = !flash
            re?.render(undefined, undefined, flash)
        } ,500)
    }
        
    onCleanup(() => {
        if(timer) {
            clearInterval(timer)
        }
        window.removeEventListener("keydown", handleKeyDown)
        console.log('GameMap dismounted!')
    });
    createEffect(() => {
        innerSize() // trigger dependency
        re.render(
            transformEntities(props.game.entities, props.game, props.team),
            transformItems(props.team))
    })

    const handleKeyDown = (event: KeyboardEvent) => {
        if(!props.team) {
            return
        }
        if(document.getElementById('teamInput') === document.activeElement) {
            return
        }
        if(event.code === 'KeyR') {
            event.preventDefault()
            resetMovesLeft(props.team, props.setMovesLeft!)
        }
        if((props.movesLeft ?? 0) <= 0) {
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
            props.setMovesLeft!(Math.max(0, props.movesLeft! - 1))
            insertMove.call(input, moveCallback)
        }
    }

    const moveCallback = (error: any/*, result: any*/) => {
        if(error) {
            props.setMovesLeft!(props.movesLeft! + 1)
            console.log(error)
        }
    }

  return <canvas ref={canvasRef} tabIndex='0' id="game-map" width='300px' height='300px' ></canvas>
}

function transformEntities(entities: EntityInstance[], game: Game, team?: Team) {
    // Yes, team is sometimes empty object :O
    if(!team || !team.position) {
        return [...entities]
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
        facingDir: team.facingDir,
        flashing: team.state === 'FROZEN'
            && (game.statusId === GameStatus.Running || game.statusId === GameStatus.OutOfTime)
    })

    return entities
}

function transformItems(team: Team | undefined) {
    if(!team?.pickedUpEntities) {
        return []
    }
    return team.pickedUpEntities.map(entId => {
        const type = entities.find(ent => ent.id === entId) ?? items.find(item => item.id === entId)
        return entityTypes.find(t => t.typeId === type!.type)!.spriteMapOffset
    }).slice(/*-31*/ -38)
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