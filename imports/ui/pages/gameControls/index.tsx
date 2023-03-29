import { useNavigate, useParams, useSearchParams } from "@solidjs/router"
import Menu from "@suid/icons-material/Menu"
import VisibilityOff from "@suid/icons-material/VisibilityOff"
import HelpIcon from "@suid/icons-material/Help"
import { TextField } from "@suid/material"
import { createEffect, createSignal, onMount, onCleanup, Show } from "solid-js"
import { createFindOne, createSubscribe } from "solid-meteor-data"
import ManagedSuspense from "../../components/managedSuspense"
import useClass from "../../utils/useClass"
import useTitle from "../../utils/useTitle"
import Guide from "./guide"
import Tabs from "./tabs"
import { TeamsCollection, Team } from "/imports/api/collections/teams"
import TeamControlsBox from "./teamControlsBox"
import { Game, GameCollection } from "/imports/api/collections/games"

export default function GameControls() {
  useClass('input-page')
  useTitle('Zadávátko | MaSo 2023')
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [tabList, setTabList] = createSignal<string[]>([])
  let prevTeamNum: string | undefined

  const loading = createSubscribe('game', () => params.code)
  const [found, gameFound] = createFindOne(() => loading() ? null : GameCollection.findOne({code: params.code}))
  const game = gameFound as Game

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

  const showGuide = () => !teamNum() || (!prevTeamNum && !tFound())

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

  createEffect(() => {
    const canvas = document.getElementById("game-map") as HTMLCanvasElement
    if(team?.number && canvas) {
      canvas.focus()
    } else {
      document.getElementById("teamInput")?.focus()
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

  const focusTeamInput = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      document.getElementById('teamInput')?.focus()
    }
  }
  onMount(() => {
    document.addEventListener("keydown", focusTeamInput, false)
  })
  onCleanup(() => {
    document.removeEventListener("keydown", focusTeamInput, false)
  })

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
          style={{ 'margin-top': '2px', 'min-width': '100px', 'width': '140px' }}
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
      <div class='app-bar-button hastooltip' onClick={() => setTeamNum(undefined)}><HelpIcon /><span class='tooltiptext'>Nápověda</span></div>
      <div class='app-bar-button hastooltip' onClick={() => navigate(`/${params.code}`)}><Menu /><span class='tooltiptext'>Zpět do menu</span></div>
    </div>
    <Show when={!showGuide()}>
      <TeamControlsBox game={game} team={team} />
    </Show>
    <Show when={showGuide()}>
      <Guide />
    </Show>
  </ManagedSuspense>
}