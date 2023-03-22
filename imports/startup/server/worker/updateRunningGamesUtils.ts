import { Game } from "/imports/api/collections/games"
import { TeamsCollection } from "/imports/api/collections/teams"

export { getTeams }

function getTeams(game: Game) {
    return TeamsCollection.find({ gameId: game._id }).fetch()
}