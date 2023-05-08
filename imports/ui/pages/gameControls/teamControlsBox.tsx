import { Index, Show, createMemo } from "solid-js";
import GameDisplayBox from "../projector/gameDisplayBox";
import { Game } from "/imports/api/collections/games";
import { Team } from "/imports/api/collections/teams";
import { isTeamFrozen, isTeamHunting } from "/imports/core/utils/misc";
import { useCurTime } from "../../utils/curTimeProvider";
import { formattedMS } from "../../utils/utils";

type Props = {
    game: Game
    team: Team | undefined
    movesLeft: number
    setMovesLeft: (moves: number) => void
    loading?: boolean
}

export default function TeamControlsBox(props: Props) {
    const curTime = useCurTime()

    const visibleTaskCount = () => {
        if(props.team?.solvedTasks) {
            return Math.min(
                props.game.totalTasksCount, 
                props.team.solvedTasks.length + props.team.changedTasks.length + props.game.initiallyIssuedTasks
            )
        }
        return 0
    }
    const tasks = () => [...Array(visibleTaskCount() + 1).keys()].slice(1)


    const isFrozen = createMemo(() =>
        isTeamFrozen(props.game, props.team, curTime())
    )
    const isInvincible = createMemo(() =>
        props.team
        && props.team.stateEndsAt
        && props.team.state === 'FROZEN'
        && !isFrozen()
    )
    const isHunting = createMemo(() => 
        isTeamHunting(props.team, curTime())
    )
    const boostCount = () => props.team?.boostData.movesLeft ?? 0

    return <div class='team-controls-box'>
        <div class='teamcontrols' style={{display: "flex", "flex-direction": 'column', width: 'fit-content'}}>
            <div class='teamtitle input-page-text' style={{display: 'flex', "justify-content": 'space-between', padding: '8px'}}>
                <span>{props.team?.number ?? '###'} - {props.team?.name?.substring(0,18)}</span>
                <span>skóre: {props.team?.score?.total ?? 0}</span>
            </div>
            <GameDisplayBox 
                game={props.game}
                team={!props.loading ? props.team : undefined}
                inputPage
                loading={props.loading}
                movesLeft={props.movesLeft}
                setMovesLeft={props.setMovesLeft}
            />
            <div class='tasks' id='tasks-container'>{/*Příklady:*/}
            <Index each={tasks()}>{(task) =>
                <div class='task-box' classList={{
                    solved: props.team!.solvedTasks.includes(task()),
                    exchanged: props.team!.changedTasks.includes(task()),
            }}>{task()}</div>}</Index>
            </div>
        </div>
        <div style={{ display: 'flex', "flex-direction":'column', "justify-content": 'center' }}>
            <div style={{ display: 'flex', "flex-direction":'column', height: 'fit-content', width: 'fit-content', gap: '1vh' }}>
                <Show when={isHunting()}>
                    <div class='white-box moves-infobox' /*style={{"font-size": '2vh'}}*/>
                        <div>Tým loví</div>
                        <div>duchy!</div>
                        <div>Zbývá:</div>
                        <div style={{ "font-size": '5vh', "margin-top": '3vh' }}>{formattedWithZero(props.team!.stateEndsAt!.getTime() - curTime())}</div>
                        <div style={{"font-size": '2vh', "margin-top": '1vh'}}>Nebo {boostCount()} {boostCount() > 4 ? 'tahů' : (boostCount() > 1 ? 'tahy' : 'tah')}</div>
                        <ProjectorTime game={props.game} team={props.team!} />
                    </div>
                </Show>
                <Show when={isInvincible()}>
                    <div class='white-box moves-infobox' style={{"font-size": '2vh'}}>
                        <div>Dokud se tým</div>
                        <div>nepohne, je</div>
                        <div>nezranitelný</div>
                    </div>
                </Show>
                <div class='white-box moves-infobox'>
                    <Show when={isFrozen()}>
                        <div>Tým je</div>
                        <div>zamrzlý!</div>
                        <div>Zbývá:</div>
                        <div style={{ "font-size": '5vh', "margin-top": '3vh' }}>{formattedWithZero(props.team!.stateEndsAt!.getTime() - curTime())}</div>
                        <ProjectorTime game={props.game} team={props.team!} />
                    </Show>
                    <Show when={!isFrozen()}>
                        <div>Zbývá tahů</div>
                        <div style={{ "font-size": '5vh', "margin-top": '3vh' }}>{props.movesLeft}</div>
                    </Show>
                </div>
                <div class='below-moves-infobox input-page-text'>celkem{isFrozen() ? ' tahů' : ''}: {props.team?.money ?? '#'}</div>
                <Show when={props.team?.boostCount ?? 0 > 0}>
                    <div class='below-moves-infobox input-page-text'>maso: {props.team!.boostCount}</div>
                </Show>
            </div>
        </div>
    </div>
}

function ProjectorTime(props: {game: Game, team: Team}) {
    return <>
        <div style={{ "font-size": '2.2vh', "margin-top": '3vh' }}>Na projektoru:</div>
        <div style={{"font-size": '3vh', "margin-top": '1vh'}}>{formattedWithZero(props.game.endAt.getTime() - props.team!.stateEndsAt!.getTime())}</div>
    </>
}

function formattedWithZero(ms: number) {
    return ms <= 0 ? '#:##' : formattedMS(ms)
}