import { Game, GameCollection } from "/imports/api/collections/games"
import { GameStatus, TaskStatus } from "/imports/core/enums"
import { getTeams } from "./updateRunningGamesUtils"
import { TasksCollection } from "/imports/api/collections/tasks"
import { Random } from 'meteor/random'
import { Simulation } from "../simulation/Simulation"
import cacheResults from "./cacheResults"
import {InteractionsCollection} from "/imports/api/collections/interactions";
import {playerStartPos} from "/imports/data/map";

function getRunningGames(now: Date) {
  return GameCollection.find({
    $or: [{
        startAt: { $lte: now },
        endAt: { $gte: now }, }, {
        statusId: GameStatus.Running,
    }]
  }).fetch()
}

async function updateRunningGames() {
  const now = new Date(new Date().setSeconds(0,0))
  const runningGames = getRunningGames(now)
  console.log('Running games:', runningGames.map(game => game.code))
  await Promise.all(runningGames.map(async game => {
    if( checkGameStatus(game, now) ) {
      const simulation = new Simulation({ game, now })
      const moved = simulation.moveMonsters()
      if(moved) {
        simulation.spawnItems()
        simulation.checkCollisions(now.getTime())
        simulation.saveEntities()
      }
      cacheResults(game._id)
    }
  }))
}

async function moveMonsters() {
  const now = new Date(new Date().setMilliseconds(0))
  if(now.getSeconds() === 0) {
    return
  }
  const runningGames = getRunningGames(now)
  console.log('Running games:', runningGames.map(game => game.code))
  await Promise.all(runningGames.map(async game => {
    if( game.statusId === GameStatus.Running || game.statusId === GameStatus.OutOfTime ) {
      const simulation = new Simulation({ game, now })
      const moved = simulation.moveMonsters()
      if(moved) {
        simulation.checkCollisions(now.getTime())
        simulation.saveEntities()
      }
    }
  }))
}

export const INITIAL_SETUP_USER_ID = "initialsetupuserid";
function checkGameStatus(game: Game, now: Date)
{
  if(game.statusId === GameStatus.Created )
  {
    console.log(`Initializing game: ${game.code}`)
    GameCollection.update({ _id: game._id },{ $set: { statusId: GameStatus.Running } })
    const teams = getTeams(game)

    const bulkTeams = TasksCollection.rawCollection().initializeUnorderedBulkOp()
    const bulkInteractions = InteractionsCollection.rawCollection().initializeUnorderedBulkOp()
    const statusId = TaskStatus.Issued
    teams.forEach(team => {
      bulkInteractions.insert({
        gameId: game._id,
        teamId: team._id,
        newPos: playerStartPos,
        userId: INITIAL_SETUP_USER_ID,
        teamNumber: team.number,
        facingDir: "RIGHT",
        moved: true,
        collisions: [],
        createdAt: new Date(),
      });
      for (let i = 1; i <= game.initiallyIssuedTasks; i++) {
        bulkTeams.insert({
          _id: Random.id(),
          number: i,
          teamId: team._id,
          statusId,
          gameId: game._id,
          changelog: [{ userId: game.userId, statusId, updatedAt: new Date().toISOString() }],
          isRevoked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
     }
    })
    if(teams.length > 0) {
      bulkTeams.execute();
      bulkInteractions.execute();
    }
    return true
  }

  if (game.statusId === GameStatus.Running && game.endAt <= now) {
    console.log(`Game ${game.code}: Evaluation skipped, as the game is out of time`)
    GameCollection.update({ _id: game._id },{ $set: { statusId: GameStatus.OutOfTime } })
    return true
  }

  return true
}

export {updateRunningGames, moveMonsters}