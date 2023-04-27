import SimpleSchema from 'simpl-schema'
import { TaskStatus } from '/imports/core/enums';
import { badRequest } from './utils/restErrors';
import { Game } from '../api/collections/games';
import { Team, TeamsCollection } from '../api/collections/teams';
import { Task, TasksCollection } from '../api/collections/tasks';
import { TaskInputWithUser, TaskActionsArr, TaskReturnData } from './interfaces';
import { gameCache } from '../server/dbCache';
import { TaskContext } from './utils/moveContext';
import { Promise } from 'meteor/promise'

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

  const context = new TaskContext(data.userId, data.gameCode, data.teamNumber.toString())

  const task = context.tasks.find(task => task.number === data.taskNumber)
  if (!task) {
    return badRequest('Tým k příkladu zatím nemá přístup.')
  }
  switch (data.action) {
    case 'solve':
      return solve(context, task)
    case 'exchange':
      return exchange(context, task)
    case 'cancel':
      return cancel(context, task)
    default:
      return badRequest('Neplatná akce.')
  }
}

function solve(context: TaskContext, task: Task) {
  const game = context.game
  const team = context.team
  switch (task.statusId) {
    case TaskStatus.Issued:
      setTaskStatus(context, task, TaskStatus.Solved)
      const nextTaskNumber = issueNewTask(context)
      updateAndCache(context, {
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

function exchange(context: TaskContext, task: Task) {
  const team = context.team
  switch (task.statusId) {
    case TaskStatus.Issued:
      const mayExchange = mayExchangeTask(context)
      if (!mayExchange) {
        return badRequest('Tým už vyměnil maximum příkladů.')
      }
      setTaskStatus(context, task, TaskStatus.Exchanged)
      const nextTaskNumber = issueNewTask(context)
      updateAndCache(context, {
        $push: {
          changedTasks: task.number,
        }
      })
      return returnData(team, { number: task.number, statusId: TaskStatus.Exchanged }, nextTaskNumber)
    case TaskStatus.Solved:
      return badRequest('Tým už příklad vyřešil.')
    case TaskStatus.Exchanged:
      return returnData(team, task, null)
  }
}

function cancel(context: TaskContext, task: Task) {
  const game = context.game
  const team = context.team
  switch (task.statusId) {
    case TaskStatus.Issued:
      return returnData(team, task, null)
    case TaskStatus.Solved:
      revokeLastIssuedTask(context)
      setTaskStatus(context, task, TaskStatus.Issued)
      updateAndCache(context,{
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
      revokeLastIssuedTask(context)
      setTaskStatus(context, task, TaskStatus.Issued)
      updateAndCache(context, {
        $pull: {
          changedTasks: task.number,
        }
      })
      return returnData(team, { number: task.number, statusId: TaskStatus.Issued }, null)
  }
}

function setTaskStatus(context: TaskContext, task: Task, statusId: TaskStatus) {
  return TasksCollection.update(task._id, {
    $set: { userId: context.userId, statusId, updatedAt: new Date() },
    $push: { changelog: { userId: context.userId, statusId, createdAt: new Date().toISOString() } }
  }, {}, () => { })
}

function mayExchangeTask(context: TaskContext) {
  const exchangedTasksCount = context.tasks.filter(
    task => task.statusId === TaskStatus.Exchanged && !task.isRevoked).length
  return exchangedTasksCount < context.game.totalExchangeableTasksCount
}

function issueNewTask(context: TaskContext) {
  const game = context.game
  const team = context.team
  const registeredTasksNumbers = context.tasks.map(task => task.number)
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
      userId: context.userId!,
      statusId: TaskStatus.Issued,
      createdAt: new Date(),
    }],
    createdAt: new Date(),
    updatedAt: new Date(),
  }, () => { })
  return nextTaskNumber
}

function revokeLastIssuedTask(context: TaskContext) {
  const lastIssuedTasks = [...context.tasks].reverse().filter(task => task.statusId === TaskStatus.Issued)
  if (lastIssuedTasks.length > 0) {
    TasksCollection.update(lastIssuedTasks[0]._id, {
      $set: { userId: context.userId, isRevoked: true, updatedAt: new Date() }
    }, {}, () => { })
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

function updateAndCache(context: TaskContext, query: any) {
  const team = context.team
  const p = TeamsCollection.rawCollection().findOneAndUpdate({ _id: team._id }, query, { returnDocument: 'after' })
  const updated = Promise.await(p).value
  context.updateCache(updated)
}