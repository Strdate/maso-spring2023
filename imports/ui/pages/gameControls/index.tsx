import Menu from "@suid/icons-material/Menu"
import VisibilityOff from "@suid/icons-material/VisibilityOff"
import { Button, TextField, Toolbar } from "@suid/material"
import useClass from "../../utils/useClass"
import Tabs from "./appBar/tabs"

export default function GameControls() {
  useClass('input-page')
    return <div class='app-bar'>
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
            /*onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                selectTeam(ev.target.value)
                ev.target.value = ''
                ev.preventDefault()
              }
            }}*/
          />
        <Tabs tabList={[ {name: 'Ahoj', active: false}, {name: 'Bahoj', active: true} ]} />
        <div class='app-bar-button'><VisibilityOff /></div>
        <div class='app-bar-button'><Menu /></div>
</div>

}