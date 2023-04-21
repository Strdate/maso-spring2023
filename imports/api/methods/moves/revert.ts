import { ValidatedMethod } from 'meteor/mdg:validated-method';
import {InteractionGameTeamInput, RevertMoveInputSchema} from '../../collections/interactions';
import revertMove from "/imports/core/revertMove";

export default new ValidatedMethod({
  name: 'moves.revert',
  validate: RevertMoveInputSchema.validator(),
  run(input: InteractionGameTeamInput) {
    return revertMove({ ...input, userId: this.userId, isSimulation: this.isSimulation });
  }
})