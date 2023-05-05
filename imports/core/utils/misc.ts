import { Pos } from "../interfaces";
import { Game } from "/imports/api/collections/games";
import { Team } from "/imports/api/collections/teams";

function formatPath(path: Pos[]) {
    return path.map(n => `[${n[0]},${n[1]}]`).join(' -> ')
}

function isTeamHunting(team?: Team, now?: number) {
    now ??= new Date().getTime()
    return team
        && team.boostData
        && team.state === 'HUNTING'
        && team.stateEndsAt
        && (team.stateEndsAt.getTime() > now)
        && team.boostData.movesLeft > 0
}

function isTeamFrozen(game: Game, team?: Team, now?: number) {
    now ??= new Date().getTime()
    return team
        && team.state === 'FROZEN'
        && team.stateEndsAt
        && ((team.stateEndsAt.getTime() > now)
        || team.stateEndsAt.getTime() > game.endAt.getTime())
}

function errorCallback(error: any, id: string) {
    if(error) {
        console.log(`Error in DB callback function! ID: ${id}`)
        console.log(error)
    }
}

export { formatPath, isTeamHunting, isTeamFrozen, errorCallback }