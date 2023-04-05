import { Meteor } from 'meteor/meteor'
import { Game, GameCollection, GameInputSchema } from '/imports/api/collections/games'
//import { ResultsCollection } from '/imports/api/collections/results'
import {TeamInputSchema, TeamsCollection} from "/imports/api/collections/teams";
import * as enums from "../imports/core/enums";
import { ResultsCollection } from '/imports/api/collections/results';

Meteor.publish('game', function(code) {
    GameInputSchema.pick('code').validate({ code })
    return GameCollection.find({ code }, { fields: { authorizedUsers: 0 } })
})

Meteor.publish('results', function(code) {
    GameInputSchema.pick('code').validate({ code })
    return ResultsCollection.find({ gameCode: code })
})

Meteor.publish('teams', function (gameCode) {
    GameInputSchema.pick('code').validate({ code: gameCode })
    const game = GameCollection.findOne({ code: gameCode })
    if(!game) {
        return []
    }
    if(!this.userId || !checkGameAccess(game, this.userId)) {
        return []
    }
    return TeamsCollection.find({ gameId: game._id })
})

Meteor.publish('team', function (gameCode, teamNum) {
    GameInputSchema.pick('code').validate({ code: gameCode })
    TeamInputSchema.pick('number').validate({ number: teamNum })
    const game = GameCollection.findOne({ code: gameCode });
    if(!game) {
        return []
    }
    if(!this.userId || !checkGameAccess(game, this.userId)) {
        return []
    }
    return TeamsCollection.find({ gameId: game._id, number: teamNum })
})

/*function isSubAuthorized(game: Game, userId: string) {
    return game.authorizedUsers.includes(userId)
}*/

function checkGameAccess(game: Game, userId: string) {
    return game.authorizedUsers.includes(userId) || game.statusId === enums.GameStatus.Finished;
}

/*Meteor.publish('game', function (code) {
    try {
        GameInputSchema.pick('code').validate({ code })
        const game = GameCollection.findOne({ code })
        const userId = this.userId
        if(!game) {
            return []
        }
        if(!userId || !isSubAuthorized(game, userId)) {
            return [
                GameCollection.find(
                    { code },
                    { fields: {authorizedUsers: 0} }
            )]
        }
        return [
            GameCollection.find({ code }),
            Meteor.users.find(
                { _id: { $in: game.authorizedUsers } },
                { fields: { _id: 1, username: 1 } },
            ),
            ResultsCollection.find(
                { gameId: game._id },
                { fields: { _id: 1, number: 1, name: 1, isBot: 1 } }
            ),
        ]
    } catch(er) {
        console.log(er)
        return []
    }
})*/