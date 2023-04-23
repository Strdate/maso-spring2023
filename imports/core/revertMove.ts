import {
    InteractionsCollection,
    InteractionGameTeamInput, Interaction
} from "../api/collections/interactions";
import { Meteor } from 'meteor/meteor'
import { Team, TeamsCollection } from "../api/collections/teams";
import { MeteorMethodBase } from "./interfaces";
import { checkCollision } from "./interaction";
import TeamQueryBuilder from "./utils/teamQueryBuilder";
import {checkGame, getLastInteractions, getTeam} from "./utils/moves";
import { isTeamFrozen, isTeamHunting } from "./utils/misc";


const MAX_TIME_TO_REVERT = 60_000;  // ms
export default function revertMove({ gameId, teamId, userId, isSimulation }:
                                     InteractionGameTeamInput & MeteorMethodBase) {
    // Has to be in isSimulation to only happen on the server.
    if(!isSimulation) {
        // Check
        const now = new Date().getTime();
        const game = checkGame(userId, gameId, isSimulation);
        const team = getTeam(gameId, teamId);
        checkTeamState(team);

        const [lastInteraction, lastMove, secondLastMove] = getLastInteractions(gameId, teamId);
        if (lastInteraction === undefined || lastMove === undefined || secondLastMove === undefined) {
            // The first "move" is inserted when
            throw new Meteor.Error("moves.revert.noMoveToRevert", "Tým ještě neprovedl žádný tah.");
        }
        checkIfLastInteractionIsRevertible(lastInteraction, now);

        const teamQB = new TeamQueryBuilder();
        teamQB.qb.set({
            position: secondLastMove.newPos,
            facingDir: secondLastMove.facingDir,
            // do not update if it didn't change
            state: isTeamHunting(team, now) ? 'HUNTING' : 'PLAYING',
            stateEndsAt: isTeamHunting(team, now) ? team.stateEndsAt : undefined,
        })
        teamQB.qb.inc({ money: 1 });
        team.position = secondLastMove.newPos;

        if(team.state === 'HUNTING') {
            teamQB.qb.inc({ 'boostData.movesLeft': 1 })
        }
        const collisions = checkCollision(game, team, teamQB, now);
        InteractionsCollection.update(lastMove._id, {
            $set: { reverted: true },
        })
        if (collisions.length > 0) {
            InteractionsCollection.insert({
                gameId,
                teamId,
                newPos: secondLastMove.newPos,
                userId: userId!,
                teamNumber: team.number,
                facingDir: secondLastMove.facingDir,
                moved: false,
                collisions: collisions,
                createdAt: new Date()
            })
        }
        TeamsCollection.update(team._id, teamQB.combine())
    }
}

function checkTeamState(team: Team) {
    if(isTeamFrozen(team)) {
        throw new Meteor.Error('moves.revert.teamFrozen', 'Tým je momentálně zamrzlý.');
    }
}

function checkIfLastInteractionIsRevertible(interaction: Interaction, nowTimestamp?: number) {
    // revertible if Move and No Collisions
    if (interaction.collisions.length) {
        throw new Meteor.Error("moves.revert.collisionDetected", "Tým interagoval ve svém posledním pohybu s okolím. Tah nelze vrátit.");
    }
    if (!interaction.moved) {
        throw new Meteor.Error("moves.revert.lastInteractionNotMove", "Poslední interakce týmu s okolím nebyl pohyb. Tah nelze vrátit.");
    }
    nowTimestamp ??= new Date().getTime();
    if (interaction.createdAt.getTime() + MAX_TIME_TO_REVERT < nowTimestamp) {
        throw new Meteor.Error("moves.revert.tooLate", "Tým již přesáhl maximální čas pro vrácení posledního tahu.")
    }
}
