import { useParams } from "@solidjs/router";
import { createEffect } from "solid-js";
import { createFindOne, createSubscribe } from "solid-meteor-data";
import GameMap from "../../components/gameMap";
import ManagedSuspense from "../../components/managedSuspense";
import useClass from "../../utils/useClass";
import useTitle from "../../utils/useTitle";
import GameTimer from "./GameTimer";
import { ProjectorCollection, IProjector } from "/imports/api/collections/projectors";

export default function Projector() {
  const params = useParams()
  useTitle('Projektor | MaSo 2023')
  useClass('projector')

  const loading = createSubscribe('projector', () => params.code)
  const [found, projectorFound] = createFindOne(() => loading() ? null : ProjectorCollection.findOne({code: params.code}))
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