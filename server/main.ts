import { Meteor } from 'meteor/meteor';
import { initWorker } from '../imports/startup/server/worker'
import '../imports/api/methods'
import '../imports/startup/server/rest-api'
import './publish'
import { createIndexes } from  '../imports/server/dbIndexes'
import { Accounts } from 'meteor/accounts-base';
import { setupAccountRules } from '/imports/server/loginListeners';
import { gameCache } from '/imports/server/dbCache';

const SEED_USERNAME = 'reznik';
const SEED_PASSWORD = 'hotdog4admins';

const USER_USERNAME = 'pomocnik'
const USER_PASSWORD = 'tatarak'

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

    if (!Accounts.findUserByUsername(USER_USERNAME)) {
      Accounts.createUser({
        username: USER_USERNAME,
        password: USER_PASSWORD,
      });
    }
  } else {
    console.log("Server is assuming SECONDARY role")
    gameCache.beginObserving()
  }

  setupAccountRules()
});
