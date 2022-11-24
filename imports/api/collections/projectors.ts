import { Mongo } from 'meteor/mongo';

/* Cache */

export interface Projector {
    _id?: string;
    gameId: string;
    name: string;
    code: string;
    startAt: Date;
    endAt: Date;
    updatedAt: Date;
  }

export const ProjectorCollection = new Mongo.Collection<Projector>('projectors');