import { FacingDir, Pos } from "../interfaces"
import QueryBuilder from "./queryBuilder"

class TeamQueryBuilder {

    position: Pos | undefined
    facingDir: FacingDir | undefined
    score: number = 0
    pickedUpEntities: number[] = []

    combine = () => {
        const qb = new QueryBuilder()

        if(this.position) {
            qb.set({ position: this.position })
        }
        if(this.facingDir) {
            qb.set({ facingDir: this.facingDir })
        }
        if(this.score > 0) {
            qb.inc({
                'score.items': this.score,
                'score.total': this.score
            })
        }
        if(this.pickedUpEntities.length > 0) {
            qb.push({ pickedUpEntities: { $each: this.pickedUpEntities } })
        }

        return qb.build()
    }
}

export default TeamQueryBuilder