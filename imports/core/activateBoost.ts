import { Team, TeamsCollection } from "../api/collections/teams";
import { ActivateBoostInput } from "../api/methods/moves/activateBoost";
import { MeteorMethodBase } from "./interfaces";
import { isTeamHunting } from "./utils/misc";
import { checkGame, getTeam } from "./utils/moves";

export default function activateBoost({ gameId, teamId, isSimulation, userId }:
    ActivateBoostInput & MeteorMethodBase) {

    const game = checkGame(userId, gameId, isSimulation)
    const team = getTeam(gameId, teamId)
    checkTeamState(team)
    TeamsCollection.update(team._id,{
        $set: {
            'boostData.movesLeft': game.bosstMaxMoves,
            'boostData.eatenEnities': [],
            state: 'HUNTING',
            stateEndsAt: new Date(new Date().getTime() + game.boostMaxTimeSecs * 1000)
        },
        $inc: {
            boostCount: -1
        }
    })
    console.log('Boost aktivován')
}

function checkTeamState(team: Team) {
    if(team.state === 'FROZEN' && team.stateEndsAt && team.stateEndsAt.getTime() > new Date().getTime()) {
        throw new Meteor.Error('moves.insert.teamFrozen', 'Tým je momentálně zamrzlý.')
    }
    if(isTeamHunting(team)) {
        throw new Meteor.Error('moves.insert.teamFrozen', 'Tým má již aktivní boost.')
    }
    if(team.boostCount <= 0) {
        throw new Meteor.Error('moves.insert.insufficientMoves', 'Nedostatek volných boostů.')
    }
}