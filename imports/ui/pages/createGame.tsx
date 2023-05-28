import { useNavigate, useParams } from '@solidjs/router'
import CreateGameMethod from '../../api/methods/games/create'
import EditGameMethod from '../../api/methods/games/edit'
import FromBase from "../components/formBase"
import useTitle from '../utils/useTitle'
import { createFindOne, createSubscribe } from 'solid-meteor-data'
import { Game, GameCollection } from '/imports/api/collections/games'

export default function CreateGame({ editing }: { editing: boolean }) {
    const params = useParams()
    const editModeText = editing ? 'Upravit hru' : 'Vytvořit hru'
    useTitle(`${editModeText} | MaSo 2023`)

    useTitle(`${params.code} | MaSo 2023`)
    let game: Game | undefined
    if(editing) {
      const loading = createSubscribe('game', () => params.code)
      const [, gameFound] = createFindOne(() => loading() ? undefined : GameCollection.findOne({code: params.code}))
      game = gameFound as Game
    }

    const navigate = useNavigate()
    const defStartDate = () => {
      const baseDate = game?.startAt ? game.startAt : new Date((new Date()).setSeconds(0,0) + 120000)
      return convertUTCDateToLocalDate(baseDate).toISOString().slice(0, -1)
    }
    return (
        <FromBase title={editModeText} showBackButton backButtonLink={editing ? `/${params.code}` : '/'} onConfirm={(res) => {
            const mapped = {
                name: res.gameName,
                code: game?.code ?? res.gameCode,
                startAt: new Date(res.startAt),
                gameTime: Number(res.gameTime),
                freezeTimeMins: Number(res.freezetime),
                monsterPanaltySecs: Number(res.monsterPenalty)
            }
            console.log(mapped)
            const method = editing ? EditGameMethod : CreateGameMethod
            method.call(mapped, err => {
                if(err)
                  alert(err)
                else
                  navigate(`/${game?.code ?? res.gameCode}`)
              })
        }}>
            <label for="gameName">Název</label>
            <input type="text" id="gameName" name="gameName" value={game?.name ?? "Test"} />
            <label for="gameCode">Kód</label>
            <input type="text" id="gameCode" name="gameCode" value={game?.code ?? "test"} disabled={editing}/>
            <label for="startAt">Začátek</label>
            <input type="datetime-local" id="startAt" name="startAt" value={defStartDate()} />
            <label for="gameTime">Doba soutěže</label>
            <input type="number" id="gameTime" name="gameTime" value={game?.startAt ? 
              (game.endAt.getTime() - game.startAt.getTime()) / 60 / 1000 : 90} />
            <label for="freezetime">Freezetime</label>
            <input type="number" id="freezetime" name="freezetime" value={game?.freezeTimeMins ?? 2} />
            <label for="monsterPenalty">Trestný čas</label>
            <input type="number" id="monsterPenalty" name="monsterPenalty" value={game?.monsterPanaltySecs ?? 480} />
            <input type="submit" value={editing ? 'Upravit' : 'Vytvořit'} />
        </FromBase>

      )
}

function convertUTCDateToLocalDate(date: Date) {
  const newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
  console.log(newDate.toUTCString())
  return newDate;   
}