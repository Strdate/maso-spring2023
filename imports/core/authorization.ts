import { Game } from "../api/collections/games"

function isGameOwner(user: Meteor.User, game: Game) {
    return user._id && game.userId === user._id
  }
  
  function isAuthorized(user: Meteor.User, game: Game) {
    return user._id && (user._id == 'robotworkeruserid' || game.authorizedUsers?.includes(user._id))
  }
  
export {
    isGameOwner,
    isAuthorized,
}
  