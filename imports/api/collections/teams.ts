import { Mongo } from 'meteor/mongo';
import { TeamScore } from '/imports/core/interfaces';
import SimpleSchema from "simpl-schema";

export interface TeamInput {
    name: string;
    number: string;
    isBot: boolean;
    gameId: string;
}

export interface Team extends TeamInput {
    _id: string;
    externalId?: string;
    userId: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    money: number;
    score: TeamScore
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
