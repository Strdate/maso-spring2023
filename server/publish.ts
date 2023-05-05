import { Meteor } from 'meteor/meteor'
import { Game, GameCollection, GameInputSchema } from '/imports/api/collections/games'
import {TeamInputSchema, TeamsCollection} from "/imports/api/collections/teams";
import * as enums from "../imports/core/enums";
import { ResultsCollection } from '/imports/api/collections/results';
import { gameCache } from '/imports/server/dbCache';

Meteor.publish('game', function(code) {
    GameInputSchema.pick('code').validate({ code })
    return GameCollection.find({ code }, { fields: { authorizedUsers: 0 } })
})

Meteor.publish('results', function(code) {
    GameInputSchema.pick('code').validate({ code })
    const game = gameCache.get(code)
    if(!checkGameAccess(game, this.userId)) {
        return []
    }
    return ResultsCollection.find({ gameCode: code })
})

Meteor.publish('teams', function (gameCode) {
    GameInputSchema.pick('code').validate({ code: gameCode })
    const game = gameCache.get(gameCode)
    if(!checkGameAccess(game, this.userId)) {
        return []
    }
    return TeamsCollection.find({ gameId: game!._id })
})

Meteor.publish('team', function (gameCode, teamNum) {
    GameInputSchema.pick('code').validate({ code: gameCode })
    TeamInputSchema.pick('number').validate({ number: teamNum })
    const game = gameCache.get(gameCode)
    if(!checkGameAccess(game, this.userId)) {
        return []
    }
    return TeamsCollection.find({ gameId: game!._id, number: teamNum })
})

function checkGameAccess(game: Game | undefined, userId: string | undefined | null) {
    return game && (
            (userId && game.authorizedUsers.includes(userId))
            || game.statusId === enums.GameStatus.Published
           )
}