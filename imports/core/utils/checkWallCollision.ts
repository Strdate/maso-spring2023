import { FacingDir, Pos } from "../interfaces";
import { facingDirToMove, normalizePosition, vectorEq, vectorSum } from "./geometry";
import { pacmanMap, playerStartPos } from "/imports/data/map";

const collisionMap: FacingDir[][] = [
    ['DOWN'],
    ['RIGHT', 'LEFT'],
    ['UP', 'DOWN'],
    ['UP', 'DOWN', 'RIGHT', 'LEFT'],
    ['DOWN', 'LEFT'],
    ['DOWN', 'RIGHT'],
    ['UP', 'LEFT'],
    ['UP', 'RIGHT'],
    ['UP', 'DOWN', 'LEFT'],
    ['UP', 'DOWN', 'RIGHT'],
    ['UP', 'RIGHT', 'LEFT'],
    ['DOWN', 'RIGHT', 'LEFT'],
    ['LEFT'],
    ['RIGHT'],
    ['RIGHT', 'LEFT'],
    ['RIGHT', 'LEFT'],
    ['DOWN', 'RIGHT', 'LEFT'] // 'UP'
]

function checkWallCollision(position: Pos, facingDir: FacingDir) {
    if(vectorEq(vectorSum(position,[0,-1]),playerStartPos) && facingDir === 'UP') { return true }
    return getAllowedMoves(position).includes(facingDir)
}

function getAllowedMoves(position: Pos) {
    const sprite = pacmanMap[position[1]-1][position[0]-1]
    return collisionMap[sprite]
}

function neighboursOf(position: Pos) {
    return getAllowedMoves(position).map(fd => normalizePosition(vectorSum(facingDirToMove(fd), position)))
}

export { checkWallCollision, getAllowedMoves, neighboursOf }