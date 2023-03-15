import {ValidatedMethod} from "meteor/mdg:validated-method";
import {TeamsCollection} from "/imports/api/collections/teams";
import {GameCollection} from "/imports/api/collections/games";
import SimpleSchema from "simpl-schema";
import * as enums from "../../../core/enums";

export default new ValidatedMethod({
  name: 'teams.delete',
  validate: new SimpleSchema({
    teamId: { type: String },
  }).validator(),
  run({ teamId }: { teamId: string }) {
    if (!this.userId) {
      throw new Meteor.Error('teams.create.notLoggedIn', 'Týmy smí přidávat jen přihlášení uživatelé.')
    }
    const team = TeamsCollection.findOne({ _id: teamId });
    if (!team) {
      console.warn("Trying to remove non-existent team")
      return;
    }
    checkGame(this.userId, team.gameId);
    if(Meteor.isServer) {
      TeamsCollection.remove({ _id: teamId });  // Itemy z kolekcí už nikdy nemažeme fuj fuj
      // cacheResults({ gameId: team.gameId, gameCode: team.gameCode });  // TODO Cache on Team removal
    }
  }
})

function checkGame(userId: string, gameId: string) {
  const game = GameCollection.findOne(gameId);
  if (!game || game.userId !== userId) {
    throw new Meteor.Error('teams.create.notGameOwner', 'Týmy do hry může přidávat jen uživatel, který hru vytvořil.');
  }
  if (game.statusId !== enums.GameStatus.Created) {
    throw new Meteor.Error('teams.create.gameAlreadyInitiated', 'Hra již byla inicializována. Nelze do ní přidat tým.');
  }
  return game;
}
