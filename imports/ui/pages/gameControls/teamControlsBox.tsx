import { Index } from "solid-js";
import GameDisplayBox from "../projector/gameDisplayBox";
import { Game } from "/imports/api/collections/games";
import { Team } from "/imports/api/collections/teams";

type Props = {
    game: Game
    team: Team | undefined
    loading?: boolean
}

export default function TeamControlsBox(props: Props) {
    //const visibleTasks = Math.min(50, solved.length + changed.length + initiallyIssuedTasks )
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

    return <div class='teamcontrols' style={{display: "flex", "flex-direction": 'column', width: 'fit-content'}}>
        <div class='teamtitle' style={{display: 'flex', "justify-content": 'space-between', padding: '8px'}}>
            <span>{props.team?.number ?? '###'} - {props.team?.name}</span>
            <span>skóre: {props.team?.score?.total ?? 0}</span>
        </div>
        <GameDisplayBox game={props.game} team={!props.loading ? props.team : undefined} inputPage loading={props.loading} />
        <div class='tasks' id='tasks-container'>Příklady:
        <Index each={tasks()}>{(task) =>
            <div class='task-box' classList={{
                solved: props.team!.solvedTasks.includes(task()),
                exchanged: props.team!.changedTasks.includes(task()),
        }}>{task()}</div>}</Index>
        </div>
    </div>
}