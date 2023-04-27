import {
    InteractionsCollection,
    InteractionGameTeamInput, Interaction
} from "../api/collections/interactions";
import { Meteor } from 'meteor/meteor'
import { Team, TeamsCollection } from "../api/collections/teams";
import { MeteorMethodBase } from "./interfaces";
import { checkCollision } from "./interaction";
import TeamQueryBuilder from "./utils/teamQueryBuilder";
import { errorCallback, isTeamFrozen, isTeamHunting } from "./utils/misc";
import { MoveContext } from "./utils/moveContext";


const MAX_TIME_TO_REVERT = 15_000;  // ms
export default function revertMove({ gameCode, teamNumber, userId, isSimulation }:
                                     InteractionGameTeamInput & MeteorMethodBase) {
    // Has to be in isSimulation to only happen on the server.
    if(!isSimulation) {
        // Check
        const context = new MoveContext(userId, gameCode, teamNumber, isSimulation)
        const team = context.team
        const game = context.game

        checkTeamState(team)
        const [lastInteraction, lastMove, secondLastMove] = getLastInteractions(game._id, team._id);
        if (lastInteraction === undefined || lastMove === undefined || secondLastMove === undefined) {
            // The first "move" is inserted when
            throw new Meteor.Error("moves.revert.noMoveToRevert", "Tým ještě neprovedl žádný tah.");
        }
        checkIfLastInteractionIsRevertible(lastInteraction, context.now);

        const teamQB = new TeamQueryBuilder();
        teamQB.qb.set({
            position: secondLastMove.newPos,
            facingDir: secondLastMove.facingDir,
        })
        const newState = isTeamHunting(team, context.now) ? 'HUNTING' : 'PLAYING'
        if(newState !== team.state) {
            teamQB.qb.set({
                state: newState,
                stateEndsAt: newState === 'HUNTING' ? team.stateEndsAt : undefined
            })
        }
        teamQB.qb.inc({ money: 1 })
        if(newState === 'HUNTING') {
            teamQB.qb.inc({ 'boostData.movesLeft': -1 })
        }
        team.position = secondLastMove.newPos;

        const col = checkCollision(game, team, teamQB, context.now)

        InteractionsCollection.update(lastMove._id, {
            $set: {
                reverted: true,
                revertedAt: new Date()
            },
        }, {}, errorCallback)
        if (col.collisions.length > 0) {
            InteractionsCollection.insert({
                gameId: game._id,
                gameCode: game.code,
                teamId: team._id,
                newPos: secondLastMove.newPos,
                userId: userId!,
                teamNumber: team.number,
                teamState: col.frozen ? 'FROZEN' : newState,
                facingDir: secondLastMove.facingDir,
                moved: false,
                collisions: col.collisions,
                createdAt: new Date()
            }, errorCallback)
        }
        TeamsCollection.update(team._id, teamQB.combine())
        context.delCache()
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

function getLastInteractions(gameId: string, teamId: string) {
    const docs = InteractionsCollection.find({gameId, teamId, reverted: { $ne: true } },
      { sort: { createdAt: -1 }, limit: 12 }).fetch()
    const lastInteraction = docs[0]
    const moves = docs.filter(d => d.moved).slice(0, 2)
    return [lastInteraction, moves[0] || undefined, moves[1] || moves[0] || undefined];
  }