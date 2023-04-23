import { untrack } from "solid-js"
import { Team } from "/imports/api/collections/teams"

const MOVES_PER_VISIT = 6

function resetMovesLeft(team: Team, resetFunc: (newMoney: number) => void) {
    resetFunc(Math.min(MOVES_PER_VISIT,untrack(() => team.money)))
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

export { resetMovesLeft, formattedMS, MOVES_PER_VISIT }