import { createFindOne, createSubscribe } from "solid-meteor-data";
import GameMap from "../../components/gameMap";
import ManagedSuspense from "../../components/managedSuspense";
import GameTimer from "./GameTimer";
import { ProjectorCollection, IProjector } from "/imports/api/collections/projectors";

export default function GameDisplayBox(props: {gameCode: string}) {
  const loading = createSubscribe('projector', () => props.gameCode)
  const [found, projectorFound] = createFindOne(() => loading() ? null : ProjectorCollection.findOne({code: props.gameCode}))
  const projector = projectorFound as IProjector

  return <ManagedSuspense loading={loading()} found={found()}>
    <div style={{display: "flex","justify-content":'center'}}>
      <div style={{display: 'flex', "flex-direction": 'column', "align-items": 'center', width:'fit-content'}}>
        <GameTimer startAt={projector.startAt} endAt={projector.endAt} />
        <GameMap projector={projector} />
      </div>
    </div>
  </ManagedSuspense>
}