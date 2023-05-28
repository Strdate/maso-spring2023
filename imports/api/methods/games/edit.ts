/// <reference path="../../../../node_modules/@types/meteor-mdg-validated-method/index.d.ts" />
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Meteor } from 'meteor/meteor'
import { GameCollection, GameInput, GameInputSchema } from '../../collections/games'
import { GameStatus } from '../../../core/enums'

export default new ValidatedMethod({
  name: 'games.edit',
  validate: GameInputSchema.validator(),
  run(game: GameInput) {
    if(Meteor.isServer)
    {
      const { gameTime, code, ...input } = game
      const dbGame = GameCollection.findOne({ code: code })
      if (!dbGame) {
        throw new Meteor.Error('games.edit.notFound', 'Hra neexistuje.')
      }
      if (this.userId !== dbGame.userId) {
        throw new Meteor.Error('games.edit.notAuthorized', 'Jen zakladatel smí hru upravovat.')
      }
      if (dbGame.statusId !== GameStatus.Created) {
        throw new Meteor.Error('games.edit.alreadyRunning', 'Hra je již spuštěná.')
      }
      GameCollection.update(dbGame._id, {
        $set: {
            ...input,
            endAt: new Date(input.startAt.getTime() + gameTime * 60 * 1000)
        }
      })
    }
  }
})