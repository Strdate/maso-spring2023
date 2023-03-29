import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { FacingDir } from '/imports/core/interfaces';


export interface MoveInput {
    gameId: string
    teamId: string
    newPos: [number, number]
}

export interface Move extends MoveInput {
    _id: string
    userId: string
    teamNumber: string
    isRevoked: boolean
    revokedByUserId?: string
    facingDir: FacingDir
    createdAt: Date
    updatedAt: Date
}

export const MovesCollection = new Mongo.Collection<Move>('moves');

export const MoveInputSchema = new SimpleSchema({
    gameId: { type: String },
    teamId: { type: String },
    newPos: { type: Array, defaultValue: new Array() },
    'newPos.$': { type: SimpleSchema.Integer }
  })