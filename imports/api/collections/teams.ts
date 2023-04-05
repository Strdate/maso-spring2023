import { Mongo } from 'meteor/mongo';
import { FacingDir, Pos, TeamScore } from '/imports/core/interfaces';
import SimpleSchema from "simpl-schema";

export type TeamState = 'PLAYING' | 'FROZEN' | 'HUNTING'

export interface TeamInput {
    name: string
    number: string
    isBot: boolean
    gameId: string
}

export interface BoostData {
    movesLeft: number
    eatenEnities: number[]
}

export interface TeamBase extends TeamInput {
    money: number
    boostCount: number
    score: TeamScore
    ghostCollisions: number
}

export interface Team extends TeamBase {
    _id: string
    externalId?: string
    userId: string
    CreatedAt: Date
    UpdatedAt: Date
    solvedTasks: number[]
    changedTasks: number[]
    position: Pos
    facingDir: FacingDir
    state: TeamState
    stateEndsAt?: Date
    boostData: BoostData
    pickedUpEntities: number[]
}

export const TeamsCollection = new Mongo.Collection<Team>('teams');

// TODO check if the indexes are really created
// Create indexes for speeeeeeeeed
if (Meteor.isServer) {
    // Index to speed up retrieval of teams for game page
    TeamsCollection.createIndex({ gameId: 1 });
}

export const TeamInputSchema = new SimpleSchema({
    gameId: { type: String },
    number: { type: String },
    name: { type: String, min: 2, max: 50 },
    isBot: { type: Boolean },
})
