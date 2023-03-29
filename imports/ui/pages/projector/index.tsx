import { useParams } from "@solidjs/router";
import useClass from "../../utils/useClass";
import useTitle from "../../utils/useTitle";
import GameDisplayBox from "./gameDisplayBox";
import { createFindOne, createSubscribe } from "solid-meteor-data";
import ManagedSuspense from "../../components/managedSuspense";
import { Game, GameCollection } from "/imports/api/collections/games";

export default function Projector() {
  useClass('projector')
  useTitle('Projektor | MaSo 2023')
  const params = useParams()

  const loading = createSubscribe('game', () => params.code)
  const [found, gameFound] = createFindOne(() => loading() ? null : GameCollection.findOne({code: params.code}))
  const game = gameFound as Game

  return <ManagedSuspense loading={loading()} found={found()}>
      <div style={{display: "flex","justify-content":'center'}}>
        <GameDisplayBox game={game} />
      </div>
    </ManagedSuspense>
}