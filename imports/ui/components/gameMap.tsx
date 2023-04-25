import { createEffect, onCleanup, onMount } from "solid-js";
import useResize from "../utils/useResize";
import RenderingEngine from "./RenderingEngine";
import { MoveInput } from "../../api/collections/interactions";
import { Team } from "/imports/api/collections/teams";
import { EntityInstance, FacingDir, Pos } from "/imports/core/interfaces";
import { facingDirToMove, vectorSum } from "/imports/core/utils/geometry";
import insertMove from "/imports/api/methods/moves/insert"
import revertMove from "/imports/api/methods/moves/revert";
import activateBoost from "/imports/api/methods/moves/activateBoost"
import { Game } from "/imports/api/collections/games";
import { entities, entityTypes, items, pacmanMap } from "/imports/data/map";
import { GameStatus } from "/imports/core/enums";
import {MOVES_PER_VISIT, resetMovesLeft} from "../utils/utils";
import useKeyHold from "../utils/useKeyHold";
import { isTeamHunting } from "/imports/core/utils/misc";
import alertify from "alertifyjs";

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

    const render = (flash?: boolean) => {
        re?.render(
            transformEntities(props.game.entities, props.game, props.inputPage, props.team),
            transformItems(props.team),
            flash)
    }

    let timer = setInterval(() => {
        flash = !flash
        render(flash)
    } ,500)
        
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
        if(!['KeyB','NumpadMultiply'].includes(code)) {
            return
        }
        activateBoost.call({
            gameCode: props.game.code,
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
        if(['KeyR'].includes(event.code)) {
            event.preventDefault()
            resetMovesLeft(props.team!, props.setMovesLeft!)
        }
        if (['Backspace','NumpadSubtract'].includes(event.code)) {
            if (props.movesLeft! < MOVES_PER_VISIT) {
                const input = {
                    gameCode: props.game.code,
                    teamId: props.team!._id,
                }
                revertMove.call(input, revertCallback);
            }

            event.preventDefault();

        }
        if((props.movesLeft ?? 0) <= 0) {
            return
        }
        const facingDir = keyToFacingDir(event.code)
        if(facingDir) {
            const input: MoveInput = {
                gameCode: props.game.code,
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

    const revertCallback = (error: any) => {
        if (error) {
            console.log(error)
            if(error.reason) {
                alertify.error(error.reason)
            } else {
                alertify.error('Neznámá chyba')
            }
        } else {
            props.setMovesLeft!(props.movesLeft! + 1);
        }
    }

  return <canvas ref={canvasRef} tabIndex='0' id="game-map" width='300px' height='300px' ></canvas>
}

function transformEntities(entities: EntityInstance[], game: Game, inputPage: boolean | undefined, team?: Team) {
    // Yes, team is sometimes empty object :O
    if(!team || !team.position) {
        return [...entities]
    }
    entities = [...entities]

    // Remove picked up items
    entities = entities.filter(ent => ent.category !== 'ITEM' || !team.pickedUpEntities.includes(ent.id) ).map(ent =>
        ({ ...ent, flashing: ent.flashing && !inputPage }))

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
    }).slice(-(pacmanMap[0].length*2))
}

function keyToFacingDir(code: string): FacingDir | undefined {
    switch(code) {
        case 'ArrowUp':
        case 'KeyW':
        case 'Numpad8':
            return 'UP'
        case 'ArrowDown':
        case 'KeyS':
        case 'Numpad2':
            return 'DOWN'
        case 'ArrowRight':
        case 'KeyD':
        case 'Numpad6':
            return 'RIGHT'
        case 'ArrowLeft':
        case 'KeyA':
        case 'Numpad4':
            return 'LEFT'
    }
}