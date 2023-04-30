import { Random } from 'meteor/random'
import SimpleSchema from 'simpl-schema'
import { badRequest, notFound } from '../errors'
import { isGameOwner } from '../../../../core/authorization'
import { Accounts } from 'meteor/accounts-base'
import { Game, GameCollection } from '/imports/api/collections/games'

interface Input {
    userId: string
    gameCode: string
    users: NewUser[]
}

interface NewUser {
    username: string
    password: string
    allowedServer?: string
}

const InputSchema = new SimpleSchema({
  userId: { type: String },
  gameCode: { type: String, min: 2, max: 32 },
  users: { type: Array, minCount: 1 },
  'users.$': { type: Object },
  'users.$.username': { type: String },
  'users.$.password': { type: String },
  'users.$.allowedServer': { type: String, optional: true }
})

export default function createAuthorizedUsers(data: Input) {
  const validator = InputSchema.newContext()
  // @ts-ignore
  validator.validate(data)
  if (!validator.isValid()) {
    return badRequest(validator.validationErrors())
  }
  const game = GameCollection.findOne({ code: data.gameCode })
  if (!game) {
    return notFound('Hra nebyla nalezena.')
  }
  if (!isGameOwner(data.userId, game)) {
    return badRequest('Nemáte dostatečná oprávnění.')
  }
  if (!usernamesDistinct(data.users)) {
    return badRequest('Uživatelé musí mít unikátní přihlašovací jména.')
  }
  const usercount = insertUsers(game, data.users)
  return { statusCode: 201, body: { createdUserCount: usercount } }
}

function insertUsers(game: Game, users: NewUser[]) {
  const ids: string[] = []
  let createdCount = 0
  users.forEach(user => {
    const dbUser = Accounts.findUserByUsername(user.username)
    if(dbUser) {
        Accounts.setPassword(dbUser._id, user.password)
        ids.push(dbUser._id)
    } else {
        ids.push(Accounts.createUser({
            username: user.username,
            password: user.password,
            // @ts-ignore
            allowedServer: user.allowedServer
        }))
        createdCount++
    }
  })
  GameCollection.update(game._id, { $set: {
    authorizedUsers: [...new Set([...game.authorizedUsers ,...ids])]
  }})
  return createdCount
}

function usernamesDistinct(users: NewUser[]) {
  const usernames = users.map(u => u.username.toLowerCase())
  return new Set(usernames).size === usernames.length
}