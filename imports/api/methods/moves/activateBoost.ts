import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { ActivateBoostInputSchema } from '../../collections/interactions'
import activateBoost from '/imports/core/activateBoost'

interface ActivateBoostInput {
    gameCode: string
    teamId: string
}

export default new ValidatedMethod({
  name: 'moves.activateBoost',
  validate: ActivateBoostInputSchema.validator(),
  run(input: ActivateBoostInput) {
    return activateBoost({ ...input, userId: this.userId, isSimulation: this.isSimulation })
  }
})

export { ActivateBoostInput }