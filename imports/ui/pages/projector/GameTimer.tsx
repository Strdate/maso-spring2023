import { createMemo, Switch, Match } from 'solid-js'
import { useCurTime } from '../../utils/curTimeProvider'
import { formattedMS } from '../../utils/utils'

type Props = {
    startAt: Date,
    endAt: Date
}

const commencingLength = 10 * 60 * 1000

export default function GameTimer(props: Props) {
    const current = useCurTime()

    const start = () => props.startAt.getTime()
    const end = () => props.endAt.getTime()
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