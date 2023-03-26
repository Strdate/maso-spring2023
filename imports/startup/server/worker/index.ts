import schedule from 'node-schedule'
import {updateRunningGames, moveMonsters} from './updateRunningGames'

function init() {
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

  schedule.scheduleJob(`0 * * * * *`, updateGames)
  schedule.scheduleJob(`20 * * * * *`, moveMonstersLoc)
  schedule.scheduleJob(`40 * * * * *`, moveMonstersLoc)
  //schedule.scheduleJob(`* * * * * *`, moveMonstersLoc)
}

export default init
