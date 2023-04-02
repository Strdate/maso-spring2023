import SimpleSchema from 'simpl-schema'
import { GameStatus, TaskStatus } from '/imports/core/enums';
import { badRequest, notFound } from './utils/restErrors';
import { Game, GameCollection } from '../api/collections/games';
import { isAuthorized } from './authorization';
import { Team, TeamsCollection } from '../api/collections/teams';
import { Task, TasksCollection } from '../api/collections/tasks';
import { TaskInputWithUser, TaskActionsArr, TaskReturnData } from './interfaces';

const InputSchema = new SimpleSchema({
  gameCode: { type: String, min: 2, max: 32 },
  teamNumber: { type: SimpleSchema.Integer, min: 1 },
  userId: { type: String },
  taskNumber: { type: SimpleSchema.Integer, min: 1 },
  // @ts-ignore
  action: { type: String, allowedValues: TaskActionsArr },
})

export default function updateTask(data: TaskInputWithUser) {
  const validator = InputSchema.newContext()
  //@ts-ignore
  validator.validate(data)
  if (!validator.isValid()) {
    return badRequest(validator.validationErrors())
  }
  const game = GameCollection.findOne({ code: data.gameCode });
  if (!game) {
    return notFound('Hra nebyla nalezena.')
  }
  if ((game.statusId !== GameStatus.Running) && (game.statusId !== GameStatus.OutOfTime)) {
    return badRequest('Hra ještě nezačala nebo už skončila.')
  }
  if (!isAuthorized(data.userId, game)) {
    return badRequest('Nemáte dostatečná oprávnění.')
  }
  const team = TeamsCollection.findOne({ number: String(data.teamNumber), gameId: game._id })
  if (!team) {
    return notFound('Tým s tímto číslem nesoutěží.')
  }
  const task = TasksCollection.findOne({ number: data.taskNumber, gameId: game._id, teamId: team._id, isRevoked: false })
  if (!task) {
    return badRequest('Tým k příkladu zatím nemá přístup.')
  }
  switch (data.action) {
    case 'solve':
      return solve(game, team, task, data.userId)
    case 'exchange':
      return exchange(game, team, task, data.userId)
    case 'cancel':
      return cancel(game, team, task, data.userId)
    default:
      return badRequest('Neplatná akce.')
  }
}

function solve(game: Game, team: Team, task: Task, userId: string) {
  switch (task.statusId) {
    case TaskStatus.Issued:
      setTaskStatus(task, TaskStatus.Solved, userId)
      const nextTaskNumber = issueNewTask(game, team, userId)
      TeamsCollection.update(team._id, {
        $inc: {
          'score.tasks': game.experiencePerTask,
          'score.total': game.experiencePerTask,
          money: game.revenuePerTask,
        },
        $push: {
          solvedTasks: task.number,
        }
      })
      return returnData(team, { number: task.number, statusId: TaskStatus.Solved }, nextTaskNumber)
    case TaskStatus.Solved:
      return returnData(team, task, null)
    case TaskStatus.Exchanged:
      return badRequest('Tým už příklad vyměnil a vzdal se tím možnosti ho vyřešit.')
  }
}

function exchange(game: Game, team: Team, task: Task, userId: string) {
  switch (task.statusId) {
    case TaskStatus.Issued:
      const mayExchange = mayExchangeTask(game, team)
      if (!mayExchange) {
        return badRequest('Tým už vyměnil maximum příkladů.')
      }
      setTaskStatus(task, TaskStatus.Exchanged, userId)
      TeamsCollection.update(team._id, {
        $push: {
          changedTasks: task.number,
        }
      })
      const nextTaskNumber = issueNewTask(game, team, userId)
      return returnData(team, { number: task.number, statusId: TaskStatus.Exchanged }, nextTaskNumber)
    case TaskStatus.Solved:
      return badRequest('Tým už příklad vyřešil.')
    case TaskStatus.Exchanged:
      return returnData(team, task, null)
  }
}

function cancel(game: Game, team: Team, task: Task, userId: string) {
  switch (task.statusId) {
    case TaskStatus.Issued:
      return returnData(team, task, null)
    case TaskStatus.Solved:
      revokeLastIssuedTask(game, team, userId)
      setTaskStatus(task, TaskStatus.Issued, userId)
      TeamsCollection.update(team._id, {
        $inc: {
          'score.tasks': -1 * game.experiencePerTask,
          'score.total': -1 * game.experiencePerTask,
          money: -1 * game.revenuePerTask,
        },
        $pull: {
          solvedTasks: task.number,
        }
      })
      return returnData(team, { number: task.number, statusId: TaskStatus.Issued }, null)
    case TaskStatus.Exchanged:
      revokeLastIssuedTask(game, team, userId)
      setTaskStatus(task, TaskStatus.Issued, userId)
      TeamsCollection.update(team._id, {
        $pull: {
          changedTasks: task.number,
        }
      })
      return returnData(team, { number: task.number, statusId: TaskStatus.Issued }, null)
  }
}

function setTaskStatus(task: Task, statusId: TaskStatus, userId: string) {
  return TasksCollection.update(task._id, {
    $set: { userId, statusId, updatedAt: new Date() },
    $push: { changelog: { userId, statusId, createdAt: new Date().toISOString() } }
  })
}

function mayExchangeTask(game: Game, team: Team) {
  const exchangedTasksCount = TasksCollection.find({
    gameId: game._id,
    teamId: team._id,
    statusId: TaskStatus.Exchanged,
    isRevoked: false,
  }).count()
  return exchangedTasksCount < game.totalExchangeableTasksCount
}

function issueNewTask(game: Game, team: Team, userId: string) {
  const registeredTasks = TasksCollection.find({
    gameId: game._id,
    teamId: team._id,
    isRevoked: false,
  }, { sort: { number: 1 } }).fetch()
  const registeredTasksNumbers = registeredTasks.map(task => task.number)
  const allTasksNumbers = getAllTaskNumbers(game)
  const availableTaskNumbers = allTasksNumbers.filter(t => !registeredTasksNumbers.includes(t))
  if (availableTaskNumbers.length === 0) {
    return null
  }
  const nextTaskNumber = Math.min(...availableTaskNumbers)
  TasksCollection.insert({
    number: nextTaskNumber,
    teamId: team._id,
    gameId: game._id,
    statusId: TaskStatus.Issued,
    isRevoked: false,
    changeLog: [{
      userId,
      statusId: TaskStatus.Issued,
      createdAt: new Date(),
    }],
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return nextTaskNumber
}

function revokeLastIssuedTask(game: Game, team: Team, userId: string) {
  const lastIssuedTask = TasksCollection.findOne({
    gameId: game._id,
    teamId: team._id,
    statusId: TaskStatus.Issued,
    isRevoked: false,
  }, { sort: { number: -1 }, limit: 1 })
  if (lastIssuedTask) {
    TasksCollection.update(lastIssuedTask._id, {
      $set: { userId, isRevoked: true, updatedAt: new Date() }
    })
  }
  return true
}

function returnData(team: Team, task: {number: number, statusId: TaskStatus}, nextTaskNumber: number | null): TaskReturnData {
  return {
    teamNumber: team.number,
    teamName: team.name,
    taskNumber: task.number,
    taskStatusId: task.statusId,
    print: Boolean(nextTaskNumber),
    printNumber: nextTaskNumber,
  }
}

function getAllTaskNumbers(game: Game) {
  return [...Array(game.totalTasksCount + 1).keys()].slice(1)
}