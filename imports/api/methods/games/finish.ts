import { ValidatedMethod } from "meteor/mdg:validated-method"
import SimpleSchema from "simpl-schema"
import { GameCollection } from "../../collections/games"
import { isGameOwner } from "/imports/core/authorization"
import { GameStatus } from "/imports/core/enums"
import cacheResults from "/imports/startup/server/worker/cacheResults"
import { gameCache } from "/imports/server/dbCache"

export default new ValidatedMethod({
    name: 'games.finish',
    validate: new SimpleSchema({
      gameId: { type: String },
    }).validator(),
    run({ gameId }) {
        const game = getGame(this.userId, gameId)
        GameCollection.update(game._id, {
            $set: {
                statusId: GameStatus.Finished,
                updatedAt: new Date()
            },
        })
        cacheResults(game._id)
        gameCache.del(game.code)
    }
  })


  function getGame(userId: string | null, gameId: string) {
    const game = GameCollection.findOne(gameId)
    if (!userId) {
        throw new Meteor.Error('games.finish.notLoggedIn', 'Pro ukončení hry musíte být přihlášení.')
      }
    if (!game || !isGameOwner(userId, game)) {
      throw new Meteor.Error('games.finish.finishNotAllowed', 'Hru může ukončit jen uživatel, který ji vytvořil.')
    }
    if (game.statusId !== GameStatus.OutOfTime) {
      throw new Meteor.Error('games.finish.notToFinish', 'Hra nyní nemůže být ukončena.')
    }
    return game
  }