import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { FacingDir, Pos } from '/imports/core/interfaces';


export interface MoveInput {
    gameId: string
    teamId: string
    newPos: Pos
}

export interface Interaction extends MoveInput {
    _id: string
    userId: string
    teamNumber: string
    facingDir?: FacingDir
    moved: boolean
    collisions: number[]
    createdAt: Date
}

export const InteractionsCollection = new Mongo.Collection<Interaction>('interactions');

export const MoveInputSchema = new SimpleSchema({
    gameId: { type: String },
    teamId: { type: String },
    newPos: { type: Array, defaultValue: new Array() },
    'newPos.$': { type: SimpleSchema.Integer }
  })

export const ActivateBoostInputSchema = new SimpleSchema({
    gameId: { type: String },
    teamId: { type: String }
})