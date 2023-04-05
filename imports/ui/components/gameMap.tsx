import { createEffect, onCleanup, onMount } from "solid-js";
import useResize from "../utils/useResize";
import RenderingEngine from "./RenderingEngine";
import { MoveInput } from "../../api/collections/interactions";
import { Team } from "/imports/api/collections/teams";
import { EntityInstance, FacingDir, Pos } from "/imports/core/interfaces";
import { facingDirToMove, vectorSum } from "/imports/core/utils/geometry";
import insertMove from "/imports/api/methods/moves/insert"
import activateBoost from "/imports/api/methods/moves/activateBoost"
import { Game } from "/imports/api/collections/games";
import { entities, entityTypes, items } from "/imports/data/map";
import { GameStatus } from "/imports/core/enums";
import { resetMovesLeft } from "../utils/utils";
import useKeyHold from "../utils/useKeyHold";
import { isTeamHunting } from "/imports/core/utils/misc";

type Props = {
    game: Game
    team?: Team
    inputPage?: boolean
    movesLeft?: number
    setMovesLeft?: (moves: number) => void
}

const HUNTED_MONSTER_OFFSET: Pos = [0, 3]
const EATEN_MONSTER_OFFSET: Pos = [1, 3]

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

    const render = (falsh?: boolean) => {
        re?.render(
            transformEntities(props.game.entities, props.game, props.team),
            transformItems(props.team),
            flash)
    }

    let timer: NodeJS.Timer
    if(props.inputPage) {
        timer = setInterval(() => {
            flash = !flash
            render(flash)
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
        render()
    })

    const checkTeamState = (): boolean => {
        if(!props.team) {
            return false
        }
        if(document.getElementById('teamInput') === document.activeElement) {
            return false
        }
        return true
    }

    const handleKeyHold = (code: string) => {
        if(!checkTeamState()) {
            return
        }
        if(code !== 'KeyB') {
            return
        }
        activateBoost.call({
            gameId: props.game._id,
            teamId: props.team!._id
        }, (error: any) => {
            console.log(error)
        })
    }
    useKeyHold(handleKeyHold)

    const handleKeyDown = (event: KeyboardEvent) => {
        if(!checkTeamState()) {
            return
        }
        if(event.code === 'KeyR') {
            event.preventDefault()
            resetMovesLeft(props.team!, props.setMovesLeft!)
        }
        if((props.movesLeft ?? 0) <= 0) {
            return
        }
        const facingDir = keyToFacingDir(event.code)
        if(facingDir) {
            const input: MoveInput = {
                gameId: props.game._id,
                teamId: props.team!._id,
                newPos: vectorSum(props.team!.position, facingDirToMove(facingDir))
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

    // Make ghosts SCARED
    if(isTeamHunting(team)) {
        entities = entities.map(ent => {
            if(ent.category !== 'MONSTER') {
                return ent
            }
            if(team.boostData.eatenEnities.includes(ent.id)) {
                return { ...ent, spriteMapOffset: EATEN_MONSTER_OFFSET, facingDir: undefined }
            }
            return { ...ent, spriteMapOffset: HUNTED_MONSTER_OFFSET, facingDir: undefined }
        })
    }

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

function transformItems(team: Team | undefined): Pos[] {
    if(!team?.pickedUpEntities) {
        return []
    }
    return team.pickedUpEntities.map(entId => {
        // TODO remove hack :)
        if(entId === -1) {
            return HUNTED_MONSTER_OFFSET
        }
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