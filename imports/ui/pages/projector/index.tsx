import { useParams } from "@solidjs/router";
import useClass from "../../utils/useClass";
import useTitle from "../../utils/useTitle";
import GameDisplayBox from "./gameDisplayBox";

export default function Projector() {
  useClass('projector')
  useTitle('Projektor | MaSo 2023')
  const params = useParams()

  return <GameDisplayBox gameCode={params.code} />
}