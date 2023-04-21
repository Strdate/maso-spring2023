/// <reference path="../../../../node_modules/@types/meteor-mdg-validated-method/index.d.ts" />
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Meteor } from 'meteor/meteor'
import { GameCollection, GameInput, GameInputSchema } from '../../collections/games'
import { GameStatus, INITIAL_SETUP_USER_ID, ROBOT_WORKER_ID } from '../../../core/enums'
import { entities, entityTypes } from '/imports/data/map'
import { EntityInstance } from '/imports/core/interfaces'
import { ResultsCollection } from '../../collections/results'

export default new ValidatedMethod({
  name: 'games.create',
  validate: GameInputSchema.validator(),
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
        authorizedUsers: [this.userId!, ROBOT_WORKER_ID, INITIAL_SETUP_USER_ID],
        createdAt: new Date(),
        updatedAt: new Date(),
        revenuePerTask: 6,
        experiencePerTask: 10,
        initiallyIssuedTasks: 6,
        totalTasksCount: 50,
        totalExchangeableTasksCount: 4,
        boostMaxTimeSecs: 360,
        bosstMaxMoves: 24,
        entities: initEntities()
      })
      ResultsCollection.insert({
        gameId: _id,
        gameCode: game.code,
        teams: [],
        UpdatedAt: new Date()
      })
      return _id
    }
  }
})

function initEntities(): EntityInstance[] {
  return entities.map(ent => {
    const type = entityTypes.find(type => type.typeId === ent.type)!
    return {
      ...ent,
      ...type
    }
  }).filter(ent => ent.category === 'MONSTER').map(ent => {
    return {
      id: ent.id,
      category: ent.category,
      spriteMapOffset: ent.spriteMapOffset,
      position: ent.startPos,
      facingDir: ent.facingDir ?? ent.program?.[0]
    }
  })
}