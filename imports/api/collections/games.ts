import { Mongo } from 'meteor/mongo';

export interface Game {
    _id: string;
    name: string;
    code: string;
    startAt: Date;
    endAt: Date;
    freezeTimeMins: number;
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

export const GameCollection = new Mongo.Collection<Game>('games');