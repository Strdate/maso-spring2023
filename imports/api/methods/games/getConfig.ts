import { ValidatedMethod } from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
import { getServerConfig } from '/imports/server/config'



export default new ValidatedMethod({
  name: 'server.config',
  validate: new SimpleSchema({}).validator(),
  run() {
    return getServerConfig().defaultGame
  }
})