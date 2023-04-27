import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { ActivateBoostInputSchema, InteractionGameTeamInput } from '../../collections/interactions'
import activateBoost from '/imports/core/activateBoost'

export default new ValidatedMethod({
  name: 'moves.activateBoost',
  validate: ActivateBoostInputSchema.validator(),
  run(input: InteractionGameTeamInput) {
    return activateBoost({ ...input, userId: this.userId, isSimulation: this.isSimulation })
  }
})