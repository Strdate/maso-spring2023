// @ts-ignore
import { Restivus } from 'meteor/nimble:restivus'
import createAuthorizedUsers from './endpoints/createAuthorizedUsers';
import getGameResults from './endpoints/getGameResults';
import createTeams from './endpoints/createTeams';

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

Api.addRoute('games/:gameCode/results', { authRequired: true }, {
  get: function () {
    console.info('GET /api/games/:gameCode/results')
    const data = { gameCode: this.urlParams.gameCode }
    const response = getGameResults(data)
    return response
  }
})

Api.addRoute('games/:gameCode/teams', { authRequired: true }, {
  post: function () {
    console.log('POST /api/games/:gameCode/teams')
    const data = {
      userId: this.userId,
      gameCode: this.urlParams.gameCode,
      teams: this.bodyParams,
    }
    const response = createTeams(data)
    console.log('Output: ', response)
    return response
  }
})