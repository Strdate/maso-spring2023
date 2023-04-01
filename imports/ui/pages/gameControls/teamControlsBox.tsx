import { Index } from "solid-js";
import GameDisplayBox from "../projector/gameDisplayBox";
import { Game } from "/imports/api/collections/games";
import { Team } from "/imports/api/collections/teams";

type Props = {
    game: Game
    team: Team | undefined
    movesLeft: number
    setMovesLeft: (moves: number) => void
    loading?: boolean
}

export default function TeamControlsBox(props: Props) {
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

    return <div class='team-controls-box'>
        <div class='teamcontrols' style={{display: "flex", "flex-direction": 'column', width: 'fit-content'}}>
            <div class='teamtitle' style={{display: 'flex', "justify-content": 'space-between', padding: '8px'}}>
                <span>{props.team?.number ?? '###'} - {props.team?.name}</span>
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
                <div class='white-box' style={{ display: 'flex', 'flex-direction': 'column', "align-items": 'center', gap: '3vh', margin: '0' }}>
                    <div>Zbývá tahů</div>
                    <div style={{ "font-size": '5vh' }}>{props.movesLeft}</div>
                </div>
                <div style={{ color: '#ffffff', "font-size": '2vh' }}>celkem: {props.team?.money ?? '#'}</div>
            </div>
        </div>
    </div>
}