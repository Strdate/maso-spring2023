import { Game } from "../api/collections/games";
import { Team } from "../api/collections/teams";
import { entityTypes, items } from "../data/map";
import { EntityInstance } from "./interfaces";
import { vectorEq } from "./utils/geometry";
import { isTeamHunting } from "./utils/misc";
import TeamQueryBuilder from "./utils/teamQueryBuilder";

const FREEZE_TIME = 0.5
const EATEN_MONSTER_ENTITY = -1
const EATEN_MONSTER_REWARD = 30

function checkCollision(game: Game, team: Team, teamQB: TeamQueryBuilder, now: number): number[] {
    const collisions: number[] = []
    game.entities.forEach(ent => {
        if(vectorEq(team.position,ent.position)) {
            console.log(`Team ${team.number} colliding with ${ent.category} id ${ent.id}`)
            const collision = collide(team, ent, teamQB, now)
            if(collision.collided) {
                collisions.push(ent.id)
                if(collision.cancelCollisions) {
                    return
                }
            }
        }
    })
    return collisions
}

function collide(team: Team, entity: EntityInstance, teamQB: TeamQueryBuilder, now: number): 
    { collided: boolean, cancelCollisions: boolean } {

    if(entity.category === 'MONSTER') {
        if(isTeamHunting(team, now)) {
            if(!team.boostData.eatenEnities.includes(entity.id)) {
                teamQB.pickedUpEntities.push(EATEN_MONSTER_ENTITY)
                teamQB.eatenEnities.push(entity.id)
                teamQB.score += EATEN_MONSTER_REWARD
                teamQB.scoreGhosts += EATEN_MONSTER_REWARD
                return { collided: true, cancelCollisions: false }
            }
            return { collided: false, cancelCollisions: false }
        }
        teamQB.qb.set({
            state: 'FROZEN',
            stateEndsAt: new Date( new Date().getTime() + FREEZE_TIME * 60000),
        })
        teamQB.pickedUpEntities.push(entity.id)
        teamQB.qb.inc({ ghostCollisions: 1 })
        return { collided: true, cancelCollisions: true }
    }
    if(entity.category === 'ITEM' && !team.pickedUpEntities.includes(entity.id)) {
        const item = items.find(item => item.id === entity.id)!
        const entityType = entityTypes.find(et => et.typeId === item.type)!
        teamQB.pickedUpEntities.push(entity.id)
        teamQB.score += entityType.reward!
        if(entityType.isBoost) {
            // plz do not put more than one boost in single spot
            teamQB.qb.inc({ boostCount: 1 })
        }
        return { collided: true, cancelCollisions: false }
    }
    return { collided: false, cancelCollisions: false }
}

export { checkCollision }