import { useNavigate } from '@solidjs/router'
import CreateGameMethod from '../../api/methods/games/create'
import FromBase from "../components/formBase"
import useTitle from '../utils/useTitle'

export default function CreateGame() {
    useTitle('Vytvořit hru | MaSo 2023')
    const navigate = useNavigate()
    const defStartDate = () => {
      const d = convertUTCDateToLocalDate(new Date((new Date()).setSeconds(0,0) + 120000)).toISOString().slice(0, -1)
      console.log(d)
      return d
    }
    return (
        <FromBase title="Vytvořit hru" showBackButton onConfirm={(res) => {
            const mapped = {
                name: res.gameName,
                code: res.gameCode,
                startAt: new Date(res.startAt),
                gameTime: Number(res.gameTime),
                freezeTimeMins: Number(res.freezetime),
                monsterPanaltySecs: Number(res.monsterPenalty)
            }
            console.log(mapped)
            CreateGameMethod.call(mapped, err => {
                if(err)
                  alert(err)
                else
                  navigate(`/${res.gameCode}`)
              })
        }}>
            <label for="gameName">Název</label>
            <input type="text" id="gameName" name="gameName" value="Test" />
            <label for="gameCode">Kód</label>
            <input type="text" id="gameCode" name="gameCode" value="test" />
            <label for="startAt">Začátek</label>
            <input type="datetime-local" id="startAt" name="startAt" value={defStartDate()} />
            <label for="gameTime">Doba soutěže</label>
            <input type="number" id="gameTime" name="gameTime" value={90} />
            <label for="freezetime">Freezetime</label>
            <input type="number" id="freezetime" name="freezetime" value={2} />
            <label for="monsterPenalty">Trestný čas</label>
            <input type="number" id="monsterPenalty" name="monsterPenalty" value={480} />
            <input type="submit" value="Vytvořit" />
        </FromBase>

      )
}

function convertUTCDateToLocalDate(date: Date) {
  const newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
  console.log(newDate.toUTCString())
  return newDate;   
}