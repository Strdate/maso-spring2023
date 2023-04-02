import DFS from "./dfs";
import { EntityInstance, FacingDir, Pos } from "/imports/core/interfaces";
import { getAllowedMoves } from "/imports/core/utils/checkWallCollision";
import { facingDirToMove, moveToFacingDir, normalizePosition, vectorDiff, vectorSum } from "/imports/core/utils/geometry";

function doSimpleMove(ent: EntityInstance): { newPos: Pos, newFacingDir?: FacingDir } {
    const newPos = normalizePosition(vectorSum(ent.position, facingDirToMove(ent.facingDir!)))
    const moves = getAllowedMoves(newPos)
    if(moves.length === 2) {
        return { newPos, newFacingDir: filterMoveByFacingDir(moves, ent.facingDir!) }
    }
    if(moves.length === 1) {
        return { newPos, newFacingDir: moves[0] }
    }
    return { newPos }
}

function graphSearch(mapState: number[][], start: Pos, exclude: Pos/*, mode: 'MIN' | 'MAX'*/): FacingDir {
    const dfs = new DFS(mapState)
    dfs.run({ start, excludeFirst: exclude })
    const longestPath = dfs.longsetPath
    console.log(`Winner: Sum: ${longestPath.sum}, path: ${longestPath.path.map(n => `[${n[0]},${n[1]}]`).join(' -> ')}`)
    return moveToFacingDir(vectorDiff(longestPath.path[1], start))!
}

function filterMoveByFacingDir(moves: FacingDir[], facingDir: FacingDir) {
    switch(facingDir) {
        case 'UP': return moves.filter(m => m !== 'DOWN')[0]
        case 'DOWN': return moves.filter(m => m !== 'UP')[0]
        case 'LEFT': return moves.filter(m => m !== 'RIGHT')[0]
        case 'RIGHT': return moves.filter(m => m !== 'LEFT')[0]
    }
}

export { doSimpleMove, graphSearch }