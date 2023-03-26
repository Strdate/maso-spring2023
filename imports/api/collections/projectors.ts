import { Mongo } from 'meteor/mongo';
import { EntityInstance } from '/imports/core/interfaces';

/* Cache */

export interface IProjector {
    _id?: string;
    gameId: string;
    name: string;
    code: string;
    startAt: Date;
    endAt: Date;
    updatedAt: Date;
    entities: EntityInstance[];
  }

export const ProjectorCollection = new Mongo.Collection<IProjector>('projectors');