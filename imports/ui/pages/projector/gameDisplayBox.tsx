import GameMap from "../../components/gameMap";
import GameTimer from "./GameTimer";
import { Game } from "/imports/api/collections/games";
import { Team } from "/imports/api/collections/teams";

type Props = {
  game: Game
  team?: Team
  inputPage?: boolean
}

export default function GameDisplayBox(props: Props) {

  return <div style={{display: 'flex', "flex-direction": 'column', "align-items": 'center', width:'fit-content'}}>
        <GameTimer startAt={props.game.startAt} endAt={props.game.endAt} />
        <GameMap game={props.game} team={props.team} inputPage={props.inputPage} />
      </div>
    
}