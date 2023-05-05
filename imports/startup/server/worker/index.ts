import schedule from 'node-schedule'
import {updateRunningGames, moveMonsters} from './updateRunningGames'
import movePlayingRobots from './movePlayingRobots'
import { gameCache } from '/imports/server/dbCache'

function initWorker() {
  const updateGames = async (invoked: Date) => {
    console.log(`Game evaluation started ${invoked}/${new Date()}`)
    try {
      await updateRunningGames()
    } catch (err) {
      console.log(err)//logger.error(err)
    }
    console.log(`Game evaluation ended ${new Date()}`)
  }

  const moveMonstersLoc = async (invoked: Date) => {
    console.log(`Moving monsters started ${invoked}/${new Date()}`)
    try {
      await moveMonsters()
    } catch (err) {
      console.log(err)//logger.error(err)
    }
    console.log(`Moving monsters ended ${new Date()}`)
  }

  const moveRobots = async (invoked: Date) => {
    console.log(`Moving robots started ${invoked}/${new Date()}`)
    try {
      await movePlayingRobots()
    } catch (err) {
      console.log(err)
    }
    console.log(`Moving robots ended ${new Date()}`)
  }

  schedule.scheduleJob(`0 * * * * *`, updateGames)
  schedule.scheduleJob(`20 * * * * *`, moveMonstersLoc)
  schedule.scheduleJob(`40 * * * * *`, moveMonstersLoc)
  schedule.scheduleJob(`10 * * * * *`, moveRobots)
}

function initPassiveWorker() {
  schedule.scheduleJob(`2 * * * * *`, () => {
    try {
      gameCache.rawCache().flushAll()
      console.log('Flushed game cache.')
    } catch(err) {
      console.log(err)
    }
  })
}

export { initWorker, initPassiveWorker }