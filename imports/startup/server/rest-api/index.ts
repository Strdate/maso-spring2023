// @ts-ignore
import { Restivus } from 'meteor/nimble:restivus'
import updateTask from '/imports/core/updateTask'

// Global API configuration
const Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });

Api.addCollection(Meteor.users, {
  excludedEndpoints: ['put', 'get', 'getAll', 'delete','patch'],
  routeOptions: {
    authRequired: true
  },
  endpoints: {
    post: {
      authRequired: false
    }
  }
})

Api.addRoute('games/:gameCode/teams/:teamNumber/tasks', { authRequired: true }, {
  put: function () {
    console.log('PUT /api/games/:gameCode/teams/:teamNumber/tasks')
    const data = {
      userId: this.userId,
      gameCode: this.urlParams.gameCode,
      teamNumber: parseInt(this.urlParams.teamNumber),
      taskNumber: parseInt(this.bodyParams.taskNumber),
      action: this.bodyParams.action,
    }
    console.log('Input:', data)
    const response = updateTask(data)
    console.log('Output: ', response)
    /*if (response.print && response.teamNumber >= 300 && response.teamNumber <= 353 && this.urlParams.gameCode === 'maso26') {
      const queue = getQueue(response)
      channel.sendToQueue(queue, Buffer.from(JSON.stringify({
        team: response.teamNumber,
        problem: response.printNumber,
      })))
    }*/
    return response
  }
})