import { Team } from "../api/collections/teams";
import { entityTypes, items } from "../data/map";
import { EntityInstance } from "./interfaces";
import TeamQueryBuilder from "./utils/teamQueryBuilder";

function collide(team: Team, entity: EntityInstance, teamQB: TeamQueryBuilder) {
    if(entity.category === 'ITEM' && !team.pickedUpEntities.includes(entity.id)) {
        const item = items.find(item => item.id + 10 === entity.id)!
        const entityType = entityTypes.find(et => et.typeId === item.type)!
        teamQB.pickedUpEntities.push(entity.id)
        teamQB.score += entityType.reward!
    }
}

export { collide }