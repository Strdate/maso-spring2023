import GameMap from "../../components/gameMap";
import GameTimer from "./GameTimer";
import { Game } from "/imports/api/collections/games";
import { Team } from "/imports/api/collections/teams";
import { Show, createSignal, onCleanup } from "solid-js";

type Props = {
  game: Game
  team?: Team
  inputPage?: boolean
  loading?: boolean
  movesLeft?: number
  setMovesLeft?: (moves: number) => void
}

export default function GameDisplayBox(props: Props) {
  const [offline, setOffline] = createSignal(false)
  const [revertingMove, setReveringMove] = createSignal(false)
  const isSuspended = () => {
    return offline() || revertingMove()
  }
  const timer = setInterval(() => {
    setOffline(!Meteor.status().connected)
  }, 5000)
  onCleanup(() => clearInterval(timer))
  const overlayText = () => {
    if(offline()) {
      return 'Offline!'
    }
    if(revertingMove()) {
      return 'Vracení tahu...'
    }
    if(props.loading) {
      return 'Loading...'
    }
  }
  return <div style={{display: 'flex', "flex-direction": 'column', "align-items": 'center', width:'fit-content'}}>
        <GameTimer startAt={props.game.startAt} endAt={props.game.endAt} />
        <div style={{position: 'relative'}}>
          <GameMap
            game={props.game}
            team={props.team}
            inputPage={props.inputPage}
            movesLeft={props.movesLeft}
            setMovesLeft={props.setMovesLeft}
            isSuspended={isSuspended()}
            setRevetingMove={setReveringMove}
          />
          <Show when={overlayText()}>
            <div class='game-overlay'>
              <div class='white-box' style={{animation: 'fadein 0.4s', border: '1px solid black'}}>{overlayText()}</div>
            </div>
          </Show>
        </div>
      </div>
    
}