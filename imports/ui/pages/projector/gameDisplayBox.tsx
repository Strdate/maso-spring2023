import GameMap from "../../components/gameMap";
import GameTimer from "./GameTimer";
import { IProjector } from "/imports/api/collections/projectors";
import { Team } from "/imports/api/collections/teams";

type Props = {
  projector: IProjector
  team?: Team
}

export default function GameDisplayBox(props: Props) {

  return <div style={{display: 'flex', "flex-direction": 'column', "align-items": 'center', width:'fit-content'}}>
        <GameTimer startAt={props.projector.startAt} endAt={props.projector.endAt} />
        <GameMap projector={props.projector} team={props.team} />
      </div>
    
}