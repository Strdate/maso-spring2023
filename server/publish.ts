import { Meteor } from 'meteor/meteor'
import { Game, GameCollection, GameInputSchema } from '/imports/api/collections/games'
import { ResultsCollection } from '/imports/api/collections/results'

Meteor.publish('game', function (code) {
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
})

function isSubAuthorized(game: Game, userId: string) {
    return game.authorizedUsers.includes(userId)
}