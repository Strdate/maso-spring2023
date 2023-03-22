import { ValidationError } from "simpl-schema/dist/esm/types"

function badRequest(message: string | ValidationError[]) {
    return { statusCode: 400, body: { type: 'BAD_REQUEST', message } }
  }
  
  function notFound(message: string | ValidationError[]) {
    return { statusCode: 404, body: { type: 'NOT_FOUND', message } }
  }
  
export {
  badRequest,
  notFound,
}
  