import {ValidatedMethod} from "meteor/mdg:validated-method";
import {TeamInput, TeamInputSchema, TeamsCollection} from "/imports/api/collections/teams";
import {GameCollection} from "/imports/api/collections/games";
import * as enums from "../../../core/enums";
import { playerStartPos } from "/imports/data/map";

export default new ValidatedMethod({
  name: "teams.create",
  validate: TeamInputSchema.validator(),
  run(team: TeamInput) {
    if (!this.userId) {
      throw new Meteor.Error('teams.create.notLoggedIn', 'Týmy smí přidávat jen přihlášení uživatelé.');
    }
    checkGame(this.userId, team.gameId);
    checkTeamForDuplicates(team.gameId, team.number);
    if (Meteor.isServer) {
      TeamsCollection.insert({
        name: team.name,
        isBot: team.isBot,
        gameId: team.gameId,
        number: team.number,
        userId: this.userId,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
        money: 0,
        position: playerStartPos,
        facingDir: 'RIGHT',
        score: {
          tasks: 0,
          total: 0,
        }
      });
      // TODO cache results
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

function checkTeamForDuplicates(gameId: string, number: string) {
  const team = TeamsCollection.findOne({ gameId, number });
  if (team) {
    throw new Meteor.Error('teams.create.teamWithSuchNumberAlreadyExists', 'Tým se zvoleným číslem již existuje.');
  }
}
