import { Game } from "../api/collections/games"

function isGameOwner(user: Meteor.User | string | null, game: Game) {
    if(!user) {
      return false
    }
    const _id = typeof user === 'string' ? user : user._id
    return game.userId === _id
  }
  
function isAuthorized(user: Meteor.User | string | null, game: Game) {
  if(!user) {
    return false
  }
  const _id = typeof user === 'string' ? user : user._id
  return _id && (_id == 'robotworkeruserid' || game.authorizedUsers?.includes(_id))
}
  
export {
    isGameOwner,
    isAuthorized,
}
  