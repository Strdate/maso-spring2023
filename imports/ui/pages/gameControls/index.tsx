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
import { TeamsCollection, Team } from "/imports/api/collections/teams"

export default function GameControls() {
  useClass('input-page')
  useTitle('Zadávátko | MaSo 2023')
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [tabList, setTabList] = createSignal<string[]>([])
  let prevTeamNum: string | undefined

  const loading = createSubscribe('projector', () => params.code)
  const [found, projectorFound] = createFindOne(() => loading() ? null : ProjectorCollection.findOne({code: params.code}))
  const projector = projectorFound as IProjector

  const [teamNum, setTeamNum] = createSignal<string | undefined>(undefined)
  createEffect(() => {
    setTeamNum((parseInt(searchParams.team) || undefined)?.toString())
  })
  createEffect(() => {
    setSearchParams({team: teamNum()})
  })

  const selectTeam = (newTeam: number) => {
    setTeamNum(newTeam.toString())
  }

  const valid = () => Boolean(!loading() && found() && teamNum())

  const teamLoading = createSubscribe(() => valid() ? 'team' : '', () => params.code, () => teamNum())
  const [tFound, teamFound] = createFindOne(() => valid() ? TeamsCollection.findOne() : null)
  const team = teamFound as Team

  createEffect(() => {
    if(teamLoading()) {
      return
    }
    console.log('Runnig effect!',tFound(),teamLoading(),teamNum(),team.number)
    // It REALLY can happen that teamNum() !== team.number :O
    if(tFound() && teamNum() === team?.number) {
      if(!tabList().includes(teamNum()!)) {
        setTabList([...tabList(), teamNum()!]).sort((a,b) => parseInt(a) - parseInt(b))
      }
      prevTeamNum = teamNum()!
    }
    if(!tFound() && tabList().includes(teamNum()!)) {
      setTabList((tabl) => tabl.filter(t => t !== teamNum()))
    }
    if(!tFound() && teamNum()) {
      alert(`Tým s číslem ${teamNum()} jsme nenašli!`)
      if(prevTeamNum && teamNum() !== prevTeamNum) {
        setTeamNum(prevTeamNum)
      } else {
        setTeamNum(undefined)
      }
    }
  })

  const removeCurTeam = () => {
    const index = tabList().findIndex(x => x === teamNum())
    if(index >= 0) {
      const newTabs = tabList().filter(t => t !== teamNum())
      const newTeamNum = newTabs.length > 0 ? newTabs[Math.min(index, newTabs.length - 1)] : undefined
      prevTeamNum = undefined
      setTeamNum(newTeamNum)
      setTabList(newTabs)
    }
  }

  return <ManagedSuspense loading={loading()} found={found()}>
    <div class='app-bar'>
      <TextField
          autoFocus//={valid() ? null : true}
          label="Číslo týmu"
          type="number"
          margin="dense"
          variant="filled"
          inputProps={{
            style: { color: 'white' },
            id: 'teamInput'}}
          InputLabelProps={{ style: { color: 'white' } }}
          style={{ 'margin-top': '2px' }}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              // @ts-ignore
              const parsedTeam = parseInt(ev.target.value)
              if(parsedTeam) {
                selectTeam(parsedTeam)
                // @ts-ignore
                ev.target.value = ''
              }
              ev.preventDefault()
            }
          }}
        />
      <Tabs tabList={tabList()} activeTab={teamNum()} callback={setTeamNum}/>
      <div class='app-bar-button hastooltip' onClick={removeCurTeam}><VisibilityOff /><span class='tooltiptext'>Odstranit tým ze záložek</span></div>
      <div class='app-bar-button hastooltip' onClick={() => navigate(`/${params.code}`)}><Menu /><span class='tooltiptext'>Zpět do menu</span></div>
      <div class='app-bar-button' onClick={() => setTeamNum(undefined)}>NÁPOVĚDA</div>
    </div>
    <Show when={teamNum()}>
      <GameDisplayBox projector={projector} />
    </Show>
    <Show when={!teamNum()}>
      <Guide />
    </Show>
  </ManagedSuspense>
}