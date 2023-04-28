import { InteractionsCollection } from "../api/collections/interactions";
import { TasksCollection } from "../api/collections/tasks";
import { TeamsCollection } from "../api/collections/teams";

function createIndexes() {
    TeamsCollection.createIndex({ gameId: 1, number: 1 })
    InteractionsCollection.createIndex({ gameId: 1, teamId: 1 })
    TasksCollection.createIndex({ gameId: 1, teamId: 1 })
}

export { createIndexes }