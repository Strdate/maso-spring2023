import { Game } from "../api/collections/games";
import { Team } from "../api/collections/teams";
import { entityTypes, items } from "../data/map";
import { EntityInstance } from "./interfaces";
import { vectorEq } from "./utils/geometry";
import { isTeamHunting } from "./utils/misc";
import TeamQueryBuilder from "./utils/teamQueryBuilder";

const EATEN_MONSTER_ENTITY = -1
const EATEN_MONSTER_REWARD = 25

function checkCollision(game: Game, team: Team, teamQB: TeamQueryBuilder, now: number): {collisions: number[], frozen: boolean} {
    const collisions: number[] = []
    for(let i = 0; i < game.entities.length; i++) {
        const ent = game.entities[i]
        if(vectorEq(team.position,ent.position)) {
            //console.log(`Team ${team.number} colliding with ${ent.category} id ${ent.id}`)
            const collision = collide(game, team, ent, teamQB, now)
            if(collision.collided) {
                collisions.push(ent.id)
                if(collision.frozen) {
                    return {collisions, frozen: true}
                }
            }
        }
    }
    return {collisions, frozen: false}
}

function collide(game: Game, team: Team, entity: EntityInstance, teamQB: TeamQueryBuilder, now: number): 
    { collided: boolean, frozen: boolean } {

    if(entity.category === 'MONSTER') {
        if(isTeamHunting(team, now)) {
            if(!team.boostData.eatenEnities.includes(entity.id)) {
                teamQB.pickedUpEntities.push(EATEN_MONSTER_ENTITY)
                teamQB.eatenEnities.push(entity.id)
                teamQB.score += EATEN_MONSTER_REWARD
                teamQB.scoreGhosts += EATEN_MONSTER_REWARD
                return { collided: true, frozen: false }
            }
            return { collided: false, frozen: false }
        }
        teamQB.qb.set({
            state: 'FROZEN',
            stateEndsAt: new Date( Math.round(new Date().getTime() / 1000 + game.monsterPanaltySecs) * 1000),
        })
        teamQB.pickedUpEntities.push(entity.id)
        teamQB.qb.inc({ ghostCollisions: 1 })
        return { collided: true, frozen: true }
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
        return { collided: true, frozen: false }
    }
    return { collided: false, frozen: false }
}

export { checkCollision }