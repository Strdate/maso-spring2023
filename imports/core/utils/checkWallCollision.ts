import { FacingDir, Pos } from "../interfaces";
import { pacmanMap } from "/imports/data/map";

const collisionMap: FacingDir[][] = [
    ['UP', 'DOWN', 'RIGHT', 'LEFT'],
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
]

export default function checkWallCollision(position: Pos, facingDir: FacingDir) {
    const sprite = pacmanMap[position[1]-1][position[0]-1]
    return collisionMap[sprite].includes(facingDir)
}