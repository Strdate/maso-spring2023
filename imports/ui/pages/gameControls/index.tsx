import { useNavigate, useParams, useSearchParams } from "@solidjs/router"
import Menu from "@suid/icons-material/Menu"
import VisibilityOff from "@suid/icons-material/VisibilityOff"
import { TextField } from "@suid/material"
import { createEffect, createSignal, Show } from "solid-js"
import { createFindOne, createSubscribe } from "solid-meteor-data"
import ManagedSuspense from "../../components/managedSuspense"
import useClass from "../../utils/useClass"
import useTitle from "../../utils/useTitle"
import GameDisplayBox from "../projector/gameDisplayBox"
import Guide from "./guide"
import Tabs from "./tabs"
import { IProjector, ProjectorCollection } from "/imports/api/collections/projectors"

export default function GameControls() {
  useClass('input-page')
  useTitle('Zadávátko | MaSo 2023')
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const loading = createSubscribe('projector', () => params.code)
  const [found, projectorFound] = createFindOne(() => loading() ? null : ProjectorCollection.findOne({code: params.code}))
  const projector = projectorFound as IProjector

  const [teamNum, setTeamNum] = createSignal<number>()
  createEffect(() => {
    setTeamNum(parseInt(searchParams.team))
  })

  return <ManagedSuspense loading={loading()} found={found()}>
    <div class='app-bar'>
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
      <div class='app-bar-button' onClick={() => setSearchParams({team: undefined})}>NÁPOVĚDA</div>
      <div class='app-bar-button'><VisibilityOff /></div>
      <div class='app-bar-button' onClick={() => navigate(`/${params.code}`)}><Menu /></div>
    </div>
    <Show when={teamNum()}>
      <GameDisplayBox projector={projector} />
    </Show>
    <Show when={!teamNum()}>
      <Guide />
    </Show>
  </ManagedSuspense>
}