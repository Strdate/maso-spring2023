import { Game } from "../api/collections/games"

function isGameOwner(user: Meteor.User, game: Game) {
    return user._id && game.userId === user._id
  }
  
function isAuthorized(user: Meteor.User | string, game: Game) {
  const _id = typeof user === 'string' ? user : user._id
  return _id && (_id == 'robotworkeruserid' || game.authorizedUsers?.includes(_id))
}
  
export {
    isGameOwner,
    isAuthorized,
}
  