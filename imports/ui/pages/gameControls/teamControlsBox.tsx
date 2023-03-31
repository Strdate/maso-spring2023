import GameDisplayBox from "../projector/gameDisplayBox";
import { Game } from "/imports/api/collections/games";
import { Team } from "/imports/api/collections/teams";

type Props = {
    game: Game
    team: Team | undefined
    loading?: boolean
}

export default function TeamControlsBox(props: Props) {
    return <div class='teamcontrols' style={{display: "flex", "flex-direction": 'column', width: 'fit-content'}}>
        <div class='teamtitle' style={{display: 'flex', "justify-content": 'space-between', padding: '8px'}}>
            <span>{props.team?.number ?? '###'} - {props.team?.name}</span>
            <span>skóre: {props.team?.score?.total ?? 0}</span>
        </div>
        <GameDisplayBox game={props.game} team={!props.loading ? props.team : undefined} inputPage loading={props.loading} />
    </div>
}