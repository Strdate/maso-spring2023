import { Meteor } from 'meteor/meteor';
import '../imports/api/methods'
import { Accounts } from 'meteor/accounts-base';

const SEED_USERNAME = 'reznik';
const SEED_PASSWORD = 'reznik';

Meteor.startup(async () => {
    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
        Accounts.createUser({
          username: SEED_USERNAME,
          password: SEED_PASSWORD,
        });
      }
});
