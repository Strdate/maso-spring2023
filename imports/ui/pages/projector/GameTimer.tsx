import { Tracker } from 'meteor/tracker'
import { TimeSync } from 'meteor/mizzao:timesync'
import { createMemo, createSignal, Switch, Match, onCleanup } from 'solid-js'

type Props = {
    startAt: Date,
    endAt: Date
}

const commencingLength = 10 * 60 * 1000

export default function GameTimer(props: Props) {
    const [currentTime, setCurrentTime] = createSignal(new Date().getTime())
    Tracker.autorun(() => {
        TimeSync.serverTime(null, 60000)
        setCurrentTime(new Date(Date.now() + TimeSync.serverOffset()).setMilliseconds(0))
    })
    const timer = setInterval( () => {
        setCurrentTime((new Date(Date.now() + TimeSync.serverOffset())).setMilliseconds(0))
    }, 100)

    onCleanup(() => clearInterval(timer))

    const current = () => new Date(currentTime()).getTime()
    const start = () => new Date(props.startAt).getTime()
    const end = () => new Date(props.endAt).getTime()
    const phase = createMemo(() => getPhase(current(), start(), end()))
    return <div class='white-box stretched timer-div'>
        <Switch>
            <Match when={phase() === 'BEFORE'}>
                Vítejte na jarním MaSu 2023
            </Match>
            <Match when={phase() === 'AFTER'}>
                Hra skončila
            </Match>
            <Match when={phase() === 'COMMENCING'}>
                Čas do začátku:&nbsp;{formattedMS(start() - current())}
            </Match>
            <Match when={phase() === 'RUNNING'}>
                Čas do konce:&nbsp;{formattedMS(end() - current())}
            </Match>
        </Switch>
    </div>
}

function formattedMS(ms: number) {
    let result = ''
    const sec = Math.round(ms / 1000)
    const hours = Math.floor(sec / 3600)
    if (hours > 0) {
      result += `${hours}:`
    }
    const minutes = Math.floor(sec / 60) - hours * 60
    const fill = hours > 0 && minutes < 10 ? '0' : ''
    return `${result + fill + minutes}:${`0${sec % 60}`.slice(-2)}`
  }

function getPhase(current: number, start: number, end: number) {
    if (start - current - commencingLength > 0) {
      return 'BEFORE'
    }
    if (start - current > 0) {
      return 'COMMENCING'
    }
    if (end - current > 0) {
      return 'RUNNING'
    }
    return 'AFTER'
  }