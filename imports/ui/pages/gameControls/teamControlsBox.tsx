import GameDisplayBox from "../projector/gameDisplayBox";
import { IProjector } from "/imports/api/collections/projectors";
import { Team } from "/imports/api/collections/teams";

type Props = {
    projector: IProjector
    team: Team | undefined
}

export default function TeamControlsBox(props: Props) {
    return <div class='teamcontrols' style={{display: "flex", "flex-direction": 'column', width: 'fit-content'}}>
        <div class='teamtitle' style={{display: 'flex', "justify-content": 'space-between', padding: '8px'}}>
            <span>{props.team?.number ?? '###'} - {props.team?.name}</span>
            <span>skóre: {props.team?.score.total ?? 0}</span>
        </div>
        <GameDisplayBox projector={props.projector} />
    </div>
}