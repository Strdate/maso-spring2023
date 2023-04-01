import { untrack } from "solid-js"
import { Team } from "/imports/api/collections/teams"

const MOVES_PER_VISIT = 6

function resetMovesLeft(team: Team, resetFunc: (newMoney: number) => void) {
    resetFunc(Math.min(MOVES_PER_VISIT,untrack(() => team.money)))
}

export { resetMovesLeft }