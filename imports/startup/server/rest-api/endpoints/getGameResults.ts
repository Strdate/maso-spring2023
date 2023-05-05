import { notFound } from '../errors'
import { ResultsCollection } from '/imports/api/collections/results'

export default function getGameResults({ gameCode }: { gameCode: string }) {
  const results = ResultsCollection.findOne({ gameCode })
  if (!results) {
    return notFound('Hra nebyla nalezena.')
  }
  return results.teams.map((t) => ({
    number: t.number,
    name: t.name,
    rank: t.rank,
    isBot: t.isBot,
    score: t.score,
    ghostCollisions: t.ghostCollisions,
    solvedTaskCount: t.solvedTaskCount,
    changedTaskCount: t.changedTaskCount,
    pickedUpItems: t.pickedUpItems
  }))
}