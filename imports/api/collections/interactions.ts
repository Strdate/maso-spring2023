import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { FacingDir, Pos } from '/imports/core/interfaces';
import { TeamState } from './teams';


export interface InteractionGameTeamInput {
    gameCode: string
    teamNumber: string
}

export interface MoveInput extends InteractionGameTeamInput {
    newPos: Pos
}

export interface Interaction extends MoveInput {
    _id: string
    gameId: string
    userId: string
    teamId: string
    teamState: TeamState
    facingDir?: FacingDir
    moved: boolean
    collisions: number[]
    createdAt: Date
    reverted?: boolean
    revertedAt?: Date
}

export const InteractionsCollection = new Mongo.Collection<Interaction>('interactions');

export const MoveInputSchema = new SimpleSchema({
    gameCode: { type: String },
    teamNumber: { type: String },
    newPos: { type: Array, defaultValue: new Array() },
    'newPos.$': { type: SimpleSchema.Integer }
  })

export const ActivateBoostInputSchema = new SimpleSchema({
    gameCode: { type: String },
    teamNumber: { type: String }
})

export const RevertMoveInputSchema = new SimpleSchema({
    gameCode: { type: String },
    teamNumber: { type: String }
})
