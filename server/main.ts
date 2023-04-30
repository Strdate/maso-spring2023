import { Meteor } from 'meteor/meteor';
import initWorker from '../imports/startup/server/worker'
import '../imports/api/methods'
import '../imports/startup/server/rest-api'
import './publish'
import { createIndexes } from  '../imports/server/dbIndexes'
import { Accounts } from 'meteor/accounts-base';

const SEED_USERNAME = 'reznik';
const SEED_PASSWORD = 'reznik';

Meteor.startup(async () => {

  if(Meteor.isDevelopment || process.env.SERVER_ROLE === 'PRIMARY') {
    console.log("Server is assuming PRIMARY role")
    createIndexes()
    initWorker()
  
    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
      Accounts.createUser({
        username: SEED_USERNAME,
        password: SEED_PASSWORD,
      });
    }
  } else {
    console.log("Server is assuming SECONDARY role")
  }

  Accounts.onCreateUser((options, user) => {
    // @ts-ignore
    if (options.allowedServer) {
      // @ts-ignore
      user.allowedServer = options.allowedServer
    }

    if (options.profile) {
      user.profile = options.profile;
    }
    console.log(`On create user. URL: ${process.env.ROOT_URL}`)
    return user;
  })
});
