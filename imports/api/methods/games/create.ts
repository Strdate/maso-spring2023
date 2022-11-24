/// <reference path="../../../../node_modules/@types/meteor-mdg-validated-method/index.d.ts" />
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
import { Meteor } from 'meteor/meteor'
import { GameCollection } from '../../collections/games'
import { ProjectorCollection } from '../../collections/projectors'

interface GameInput {
  name: string,
  code: string,
  startAt: Date,
  endAt: Date,
  freezeTimeMins: number
}

export default new ValidatedMethod({
  name: 'games.create',
  validate: new SimpleSchema({
    name: { type: String, min: 2, max: 50 },
    code: { type: String, min: 4, max: 16 },
    startAt: { type: Date },
    endAt: { type: Date },
    freezeTimeMins: { type: SimpleSchema.Integer, min: 1, defaultValue: 10 },
  }).validator(),
  run(game: GameInput) {
    if(Meteor.isServer)
    {
      const user = Meteor.user()
      if (user?.username !== 'reznik') {
        throw new Meteor.Error('games.create.notLoggedIn', 'Jen vrchní řezník smí vytvářet nové hry!')
      }
      if (GameCollection.find({ code: game.code }).count()) {
        throw new Meteor.Error('games.create.codeAlreadyTaken', 'Kód již používá někdo jiný.')
      }
      const _id = GameCollection.insert({
        ...game,
        statusId: GameStatus.Created,
        userId: this.userId!,
        authorizedUsers: [this.userId!, 'robotworkeruserid'],
        createdAt: new Date(),
        updatedAt: new Date(),
        revenuePerTask: 100,
        experiencePerTask: 10,
        initiallyIssuedTasks: 6,
        totalTasksCount: 50,
        totalExchangeableTasksCount: 4
      })
      ProjectorCollection.insert({
        gameId: _id,
        name: game.name,
        code: game.code,
        startAt: game.startAt,
        endAt: game.endAt,
        updatedAt: new Date()
      })
      // TODO cache projector
      return _id
    }
  }
})
