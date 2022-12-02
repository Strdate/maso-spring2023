import CreateGameMethod from '../../api/methods/games/create'
import FromBase from "../components/formBase"
import useTitle from '../utils/useTitle'

export default function CreateGame() {
    useTitle('Vytvořit hru | Maso 2023')
    const defStartDate = () => {
        return new Date((new Date()).setSeconds(0,0) + 120000).toISOString().slice(0, -1)
    }
    const defEndDate = () => {
        return new Date((new Date()).setSeconds(0,0) + 62*60*1000).toISOString().slice(0, -1)
    }
    return (
        <FromBase title="Vytvořit hru" onConfirm={(res) => {
            const mapped = {
                name: res.gameName,
                code: res.gameCode,
                startAt: new Date(res.startAt),
                endAt: new Date(res.endAt),
                freezeTimeMins: Number(res.freezetime)
            }
            console.log(mapped)
            CreateGameMethod.call(mapped, err => {
                if(err)
                  alert(err)
                /*if (!err) {
                  this.props.history.push(`/${data.code}`)
                }*/
              })
        }}>
            <label for="gameName">Název</label>
            <input type="text" id="gameName" name="gameName" value="Test" />
            <label for="gameCode">Kód</label>
            <input type="text" id="gameCode" name="gameCode" value="test" />
            <label for="startAt">Začátek</label>
            <input type="datetime-local" id="startAt" name="startAt" value={defStartDate()} />
            <label for="endAt">Konec</label>
            <input type="datetime-local" id="endAt" name="endAt" value={defEndDate()} />
            <label for="freezetime">Freezetime</label>
            <input type="number" id="freezetime" name="freezetime" value={2} />
            <input type="submit" value="Vytvořit" />
        </FromBase>

      )
}