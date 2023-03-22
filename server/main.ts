import { Meteor } from 'meteor/meteor';
import initWorker from '../imports/startup/server/worker'
import '../imports/api/methods'
import '../imports/startup/server/rest-api'
import './publish'
import { Accounts } from 'meteor/accounts-base';

const SEED_USERNAME = 'reznik';
const SEED_PASSWORD = 'reznik';

Meteor.startup(async () => {

initWorker()

if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
});
