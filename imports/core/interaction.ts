import { Team } from "../api/collections/teams";
import { entityTypes, items } from "../data/map";
import { EntityInstance } from "./interfaces";
import TeamQueryBuilder from "./utils/teamQueryBuilder";

const FREEZE_TIME = 8

function collide(team: Team, entity: EntityInstance, teamQB: TeamQueryBuilder): Boolean {
    if(entity.category === 'MONSTER') {
        teamQB.qb.set({
            state: 'FROZEN',
            stateEndsAt: new Date( new Date().getTime() + FREEZE_TIME * 60000)
        })
        return false
    }
    if(entity.category === 'ITEM' && !team.pickedUpEntities.includes(entity.id)) {
        const item = items.find(item => item.id + 10 === entity.id)!
        const entityType = entityTypes.find(et => et.typeId === item.type)!
        teamQB.pickedUpEntities.push(entity.id)
        teamQB.score += entityType.reward!
    }
    return true
}

export { collide }