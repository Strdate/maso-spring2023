import { Mongo } from 'meteor/mongo';
import { TeamScore } from '/imports/core/interfaces';

export interface Team {
    _id?: string;
    name: string;
    number: number;
    externalId?: string;
    isBot: boolean;
    userId: string;
    gameId: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    money: number;
    score: TeamScore
  }

export const TeamsCollection = new Mongo.Collection<Team>('teams');