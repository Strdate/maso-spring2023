import { FacingDir, Pos } from "../interfaces"
import QueryBuilder from "./queryBuilder"
import { Team, TeamState } from "/imports/api/collections/teams"

class TeamQueryBuilder {

    score: number = 0
    pickedUpEntities: number[] = []
    qb = new QueryBuilder<Team>()

    combine = () => {
        if(this.score > 0) {
            this.qb.inc({
                'score.items': this.score,
                'score.total': this.score
            })
        }
        if(this.pickedUpEntities.length > 0) {
            this.qb.push({ pickedUpEntities: { $each: this.pickedUpEntities } })
        }

        return this.qb.build()
    }
}

export default TeamQueryBuilder