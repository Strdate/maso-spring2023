import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { GameCollection } from '../../collections/games'

interface GetGameInput {
    gameCode: string
}

export default new ValidatedMethod({
  name: 'games.get',
  validate: new SimpleSchema({
    gameCode: { type: String },
  }).validator(),
  run(game: GetGameInput) {
    if(Meteor.isServer)
    {
        return GameCollection.findOne({code: game.gameCode}) != null
    }
  }
})