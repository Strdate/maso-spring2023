import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { Meteor } from 'meteor/meteor'
import updateTask from '../../../core/updateTask'
import SimpleSchema from 'simpl-schema'

export default new ValidatedMethod({
  name: 'tasks.update',
  validate: new SimpleSchema({
    data: { type: Object, blackbox: true },
  }).validator(),
  run({ data }) {
    if (!this.userId) {
      throw new Meteor.Error('tasks.update.notLoggedIn', 'Pro skenování příkladu se musíte přihlásit!')
    }
    if(Meteor.isServer)
    {
        data.userId = this.userId
        const response = updateTask(data)
        if('statusCode' in response && response.statusCode >= 400) {
            // @ts-ignore
            throw new Meteor.Error('tasks.update.generalError', response.body.message)
        }
        return response
    }
  }
})