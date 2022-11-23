import { Mongo } from 'meteor/mongo';
import { TeamScore } from '/imports/core/interfaces';

/* Cache */

interface TeamResults {
    _id: string;
    name: string;
    number: number;
    place: number;
    isBot: boolean;
    money: number;
    solvedTasksCount: number;
    score: TeamScore;
}

export interface Results {
    _id?: string;
    gameId: string;
    teams: TeamResults[];
    UpdatedAt: Date;
  }

export const ResultsCollection = new Mongo.Collection<Results>('results');