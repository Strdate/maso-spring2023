import GameMap from "../../components/gameMap";
import useClass from "../../utils/useClass";
import useTitle from "../../utils/useTitle";
import GameTimer from "./GameTimer";

export default function Projector() {
  useTitle('Projektor | MaSo 2023')
  useClass('projector')
  return <div style={{display: "flex","justify-content":'center'}}>
    <div style={{display: 'flex', "flex-direction": 'column', "align-items": 'center', width:'fit-content'}}>
      <GameTimer startAt={new Date(Date.parse("2023-03-24T11:00:00.000Z"))} endAt={new Date(Date.parse("2023-03-24T22:00:00.000Z"))} />
      <GameMap />
    </div>
  </div>
}