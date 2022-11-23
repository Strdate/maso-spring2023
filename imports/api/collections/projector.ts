import { Mongo } from 'meteor/mongo';

/* Cache */

export interface Projector {
    _id?: string;
    gameId: string;
    name: string;
    code: string;
    startAt: Date;
    endAt: Date;
    UpdatedAt: Date;
  }

export const ProjectorCollection = new Mongo.Collection<Projector>('projectors');