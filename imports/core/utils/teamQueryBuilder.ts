import QueryBuilder from "./queryBuilder"
import { Team } from "/imports/api/collections/teams"

class TeamQueryBuilder {

    score: number = 0
    scoreGhosts: number = 0
    pickedUpEntities: number[] = []
    eatenEnities: number[] = []
    qb = new QueryBuilder<Team>()

    combine = () => {
        if(this.score > 0) {
            this.qb.inc({
                'score.items': (this.score - this.scoreGhosts),
                'score.ghosts': (this.scoreGhosts),
                'score.total': this.score
            })
        }
        if(this.pickedUpEntities.length > 0) {
            this.qb.push({ pickedUpEntities: { $each: this.pickedUpEntities } })
        }
        if(this.eatenEnities.length > 0) {
            this.qb.push({ 'boostData.eatenEnities': { $each: this.eatenEnities } })
        }

        return this.qb.build()
    }

    /*updateCache = (team: Team) => {
        if(this.score > 0) {
            team.score.items = team.score.items + this.score - this.scoreGhosts
            team.score.ghosts = team.score.ghosts + this.scoreGhosts
            team.score.total = team.score.total + this.score
        }
        if(this.pickedUpEntities.length > 0) {
            team.pickedUpEntities.push(...this.pickedUpEntities)
        }
        if(this.eatenEnities.length > 0) {
            team.boostData.eatenEnities.push(...this.eatenEnities)
        }

        return this.qb.updateCache(team)
    }*/
}

export default TeamQueryBuilder