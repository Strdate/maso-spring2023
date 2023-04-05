import { Team, TeamsCollection } from "../api/collections/teams";
import { ActivateBoostInput } from "../api/methods/moves/activateBoost";
import { MeteorMethodBase } from "./interfaces";
import { isTeamHunting } from "./utils/misc";
import { checkGame, getTeam } from "./utils/moves";

const BOOST_MAX_MOVES = 24
const BOOST_MAX_TIME_MIN = 0.5

export default function activateBoost({ gameId, teamId, isSimulation, userId }:
    ActivateBoostInput & MeteorMethodBase) {

    checkGame(userId, gameId, isSimulation)
    const team = getTeam(gameId, teamId)
    checkTeamState(team)
    TeamsCollection.update(team._id,{
        $set: {
            'boostData.movesLeft': BOOST_MAX_MOVES,
            'boostData.eatenEnities': [],
            state: 'HUNTING',
            stateEndsAt: new Date(new Date().getTime() + BOOST_MAX_TIME_MIN * 60 * 1000)
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