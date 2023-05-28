import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { GameStatus } from '/imports/core/enums';
import { EntityInstance } from '/imports/core/interfaces';

interface GameBase {
  name: string
  code: string
  startAt: Date
  freezeTimeMins: number
  monsterPanaltySecs: number
}

interface GameInput extends GameBase {
  gameTime: number
}

interface Game extends GameBase {
  _id: string
  endAt: Date
  revenuePerTask: number
  experiencePerTask: number
  initiallyIssuedTasks: number
  totalTasksCount: number
  totalExchangeableTasksCount: number
  boostMaxTimeSecs: number
  boostMaxMoves: number
  statusId: GameStatus
  userId: string
  authorizedUsers: string[]
  entities: EntityInstance[]
  createdAt: Date
  updatedAt: Date
}

const GameCollection = new Mongo.Collection<Game>('games');

const GameInputSchema = new SimpleSchema({
  name: { type: String, min: 2, max: 50 },
  code: { type: String, min: 4, max: 16 },
  startAt: { type: Date },
  gameTime: { type: SimpleSchema.Integer, min: 1 },
  freezeTimeMins: { type: SimpleSchema.Integer, min: 1, defaultValue: 10 },
  monsterPanaltySecs: { type: SimpleSchema.Integer, min: 1, defaultValue: 480 }
})

export { Game, GameInput, GameCollection, GameInputSchema }