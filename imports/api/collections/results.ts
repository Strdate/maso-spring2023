import { Mongo } from 'meteor/mongo';
import { TeamBase } from './teams';

/* Cache */

export interface TeamResults extends Omit<TeamBase,'gameId'> {
    rank: number
    solvedTaskCount: number
    changedTaskCount: number
    pickedUpItems: number
}

export interface Results {
    _id: string;
    gameId: string;
    gameCode: string;
    teams: TeamResults[];
    UpdatedAt: Date;
  }

export const ResultsCollection = new Mongo.Collection<Results>('results');