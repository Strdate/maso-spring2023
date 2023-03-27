import { useParams } from "@solidjs/router";
import useClass from "../../utils/useClass";
import useTitle from "../../utils/useTitle";
import GameDisplayBox from "./gameDisplayBox";
import { createFindOne, createSubscribe } from "solid-meteor-data";
import { ProjectorCollection, IProjector } from "/imports/api/collections/projectors";
import ManagedSuspense from "../../components/managedSuspense";

export default function Projector() {
  useClass('projector')
  useTitle('Projektor | MaSo 2023')
  const params = useParams()

  const loading = createSubscribe('projector', () => params.code)
  const [found, projectorFound] = createFindOne(() => loading() ? null : ProjectorCollection.findOne({code: params.code}))
  const projector = projectorFound as IProjector

  return <ManagedSuspense loading={loading()} found={found()}>
      <GameDisplayBox projector={projector} />
    </ManagedSuspense>
}