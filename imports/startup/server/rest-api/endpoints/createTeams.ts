import { Random } from 'meteor/random'
import SimpleSchema from 'simpl-schema'
import { isGameOwner } from '../../../../core/authorization'
import { badRequest, notFound } from '../errors'
import { Game, GameCollection } from '/imports/api/collections/games'
import { GameStatus } from '/imports/core/enums'
import cacheResults from '../../worker/cacheResults'
import { Team, TeamsCollection } from '/imports/api/collections/teams'
import { Promise } from 'meteor/promise';
import { playerStartPos } from '/imports/data/map'

const InputSchema = new SimpleSchema({
  userId: { type: String },
  gameCode: { type: String, min: 2, max: 32 },
  teams: { type: Array, minCount: 1 },
  'teams.$': { type: Object },
  'teams.$.number': { type: SimpleSchema.Integer, min: 1 },
  'teams.$.externalId': { type: String },
  'teams.$.name': { type: String },
  'teams.$.isBot': { type: Boolean, defaultValue: false, optional: true },
})

interface Input {
    userId: string,
    gameCode: string,
    teams: BulkTeamInput[]
}

interface BulkTeamInput {
    number: number,
    externalId?: string,
    name: string,
    isBot?: boolean
}

export default function createTeams(data: Input) {
  const validator = InputSchema.newContext()
  // @ts-ignore
  validator.validate(data)
  if (!validator.isValid()) {
    return badRequest(validator.validationErrors())
  }
  const game = GameCollection.findOne({ code: data.gameCode })
  if (!game) {
    return notFound('Hra nebyla nalezena.')
  }
  if (!isGameOwner(data.userId, game)) {
    return badRequest('Nemáte dostatečná oprávnění.')
  }
  if (game.statusId !== GameStatus.Created) {
    return badRequest('Hra již byla inicializována.')
  }
  if (!teamNumbersDistinct(data.teams)) {
    return badRequest('Týmy musí mít unikátní čísla.')
  }
  destroyExistingTeams(game._id)
  insertTeams(data.userId, game, data.teams)
  cacheResults(game._id)
  return { statusCode: 201, body: { createdTeamsCount: data.teams.length } }
}

function insertTeams(userId: string, game: Game, teams: BulkTeamInput[]) {
  const bulk = TeamsCollection.rawCollection().initializeUnorderedBulkOp()
  teams.forEach(team => {
    const dbTeam: Team = {
      _id: Random.id(),
      name: team.name,
      gameId: game._id,
      number: team.number.toString(),
      externalId: team.externalId,
      userId,
      boostCount: 0,
      ghostCollisions: 0,
      position: playerStartPos,
      facingDir: 'RIGHT',
      state: 'PLAYING',
      boostData: {
          movesLeft: 0,
          eatenEnities: []
      },
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
      isBot: Boolean(team.isBot),
      money: 0,
      score: {tasks: 0, items: 0, ghosts: 0, total: 0},
      solvedTasks: [],
      changedTasks: [],
      pickedUpEntities: []
    }
    bulk.insert(dbTeam)
  })
  Promise.await(bulk.execute())
}

function destroyExistingTeams(gameId: string) {
  TeamsCollection.remove({ gameId })
}

function teamNumbersDistinct(teams: BulkTeamInput[]) {
  const teamNumbers = teams.map(t => t.number)
  const uniqueTeamNumbers = new Set(teamNumbers)
  return teamNumbers.length === uniqueTeamNumbers.size
}
