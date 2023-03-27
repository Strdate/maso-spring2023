import GameMap from "../../components/gameMap";
import GameTimer from "./GameTimer";
import { IProjector } from "/imports/api/collections/projectors";

export default function GameDisplayBox(props: {projector: IProjector}) {

  return <div style={{display: "flex","justify-content":'center'}}>
      <div style={{display: 'flex', "flex-direction": 'column', "align-items": 'center', width:'fit-content'}}>
        <GameTimer startAt={props.projector.startAt} endAt={props.projector.endAt} />
        <GameMap projector={props.projector} />
      </div>
    </div>
}