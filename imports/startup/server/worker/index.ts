import schedule from 'node-schedule'
import updateRunningGames from './updateRunningGames'

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

  schedule.scheduleJob(`0 * * * * *`, updateGames)
}

export default init
