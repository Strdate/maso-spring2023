import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { GameStatus } from '/imports/core/enums';

interface GameInput {
  name: string,
  code: string,
  startAt: Date,
  endAt: Date,
  freezeTimeMins: number
}

interface Game extends GameInput {
  _id: string;
  revenuePerTask: number;
  experiencePerTask: number;
  initiallyIssuedTasks: number;
  totalTasksCount: number;
  totalExchangeableTasksCount: number;
  statusId: GameStatus;
  userId: string;
  authorizedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
}

const GameCollection = new Mongo.Collection<Game>('games');

const GameInputSchema = new SimpleSchema({
  name: { type: String, min: 2, max: 50 },
  code: { type: String, min: 4, max: 16 },
  startAt: { type: Date },
  endAt: { type: Date },
  freezeTimeMins: { type: SimpleSchema.Integer, min: 1, defaultValue: 10 },
})

export { Game, GameInput, GameCollection, GameInputSchema }