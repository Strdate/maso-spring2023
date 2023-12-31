import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { MoveInput, MoveInputSchema } from '../../collections/interactions'
import insertMove from '/imports/core/insertMove'

export default new ValidatedMethod({
  name: 'moves.insert',
  validate: MoveInputSchema.validator(),
  run(input: MoveInput) {
    return insertMove({ ...input, userId: this.userId, isSimulation: this.isSimulation })
  }
})