import { Team, TeamsCollection } from "../api/collections/teams";
import { ActivateBoostInput } from "../api/methods/moves/activateBoost";
import { MeteorMethodBase } from "./interfaces";
import { isTeamFrozen, isTeamHunting } from "./utils/misc";
import { MoveContext } from "./utils/moveContext";

export default function activateBoost({ gameCode, teamId, isSimulation, userId }:
    ActivateBoostInput & MeteorMethodBase) {

    const context = new MoveContext(userId, gameCode, teamId, isSimulation)
    const team = context.team
    const game = context.game

    checkTeamState(team)
    TeamsCollection.update(team._id,{
        $set: {
            'boostData.movesLeft': game.boostMaxMoves,
            'boostData.eatenEnities': [],
            state: 'HUNTING',
            stateEndsAt: new Date(Math.round(new Date().getTime() / 1000 + game.boostMaxTimeSecs) * 1000)
        },
        $inc: {
            boostCount: -1
        }
    })
    context.delCache()
}

function checkTeamState(team: Team) {
    if(isTeamFrozen(team)) {
        throw new Meteor.Error('moves.insert.teamFrozen', 'Tým je momentálně zamrzlý.')
    }
    if(isTeamHunting(team)) {
        throw new Meteor.Error('moves.insert.teamFrozen', 'Tým má již aktivní boost.')
    }
    if(team.boostCount <= 0) {
        throw new Meteor.Error('moves.insert.insufficientMoves', 'Nedostatek volných boostů.')
    }
}