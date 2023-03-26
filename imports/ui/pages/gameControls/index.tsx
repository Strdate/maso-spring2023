import { useNavigate, useParams } from "@solidjs/router"
import Menu from "@suid/icons-material/Menu"
import VisibilityOff from "@suid/icons-material/VisibilityOff"
import { TextField } from "@suid/material"
import useClass from "../../utils/useClass"
import useTitle from "../../utils/useTitle"
import GameDisplayBox from "../projector/gameDisplayBox"
import Tabs from "./tabs"

export default function GameControls() {
  useClass('input-page')
  useTitle('Zadávátko | MaSo 2023')
  const params = useParams()
  const navigate = useNavigate()
  return <><div class='app-bar'>
      <TextField
          //autoFocus={valid ? null : true}
          label="Číslo týmu"
          type="number"
          margin="dense"
          variant="filled"
          inputProps={{
            style: { color: 'white' },
            id: 'teamInput'}}
          InputLabelProps={{ style: { color: 'white' } }}
          style={{ 'margin-top': '2px' }}
          /*onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              selectTeam(ev.target.value)
              ev.target.value = ''
              ev.preventDefault()
            }
          }}*/
        />
      <Tabs tabList={[ {name: 'Ahoj', active: false}, {name: 'Bahoj', active: true} ]} />
      <div class='app-bar-button'>NÁPOVĚDA</div>
      <div class='app-bar-button'><VisibilityOff /></div>
      <div class='app-bar-button' onClick={() => navigate(`/${params.code}`)}><Menu /></div>
    </div>
    <GameDisplayBox gameCode={params.code} />
  </>
}