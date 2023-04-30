// @ts-ignore
import { Restivus } from 'meteor/nimble:restivus'
import updateTask from '/imports/core/updateTask'
import createAuthorizedUsers from './endpoints/createAuthorizedUsers';

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

Api.addRoute('games/:gameCode/authorized-users', { authRequired: true }, {
  post: function () {
    console.log('POST /api/games/:gameCode/authorized-users')
    const data = {
      userId: this.userId,
      gameCode: this.urlParams.gameCode,
      users: this.bodyParams,
    }
    //console.log('Input:', data)
    const response = createAuthorizedUsers(data)
    console.log('Output: ', response)
    return response
  }
})