import DFS from "./dfs";
import DFS_2 from "./dfs2";
import { EntityInstance, FacingDir, Pos } from "/imports/core/interfaces";
import { getAllowedMoves } from "/imports/core/utils/checkWallCollision";
import { facingDirToMove, filterMoveByFacingDir, moveToFacingDir, normalizePosition, vectorDiff, vectorSum } from "/imports/core/utils/geometry";
import { formatPath } from "/imports/core/utils/misc";

function doSimpleMove(ent: EntityInstance): { newPos: Pos, newFacingDir?: FacingDir } {
    const newPos = normalizePosition(vectorSum(ent.position, facingDirToMove(ent.facingDir!)))
    const moves = getAllowedMoves(newPos)
    if(moves.length <= 2) {
        return { newPos, newFacingDir: filterMoveByFacingDir(moves, ent.facingDir)[0] }
    }
    return { newPos }
}

function graphSearch(mapState: number[][], start: Pos, exclude: Pos): FacingDir {
    const dfs = new DFS(mapState)
    dfs.run({ start, excludeFirst: exclude })
    const longestPath = dfs.longsetPath
    console.log(`Winner: Sum: ${longestPath.sum}, path: ${formatPath(longestPath.path)}`)
    return moveToFacingDir(vectorDiff(longestPath.path[1], start))!
}

function monsterGraphSearch(mapState: number[][], start: Pos, exclude: Pos) {
    const dfs = new DFS_2(mapState)
    const nextPos = dfs.findPath({ start, excludeFirst: exclude })
    return moveToFacingDir(vectorDiff(nextPos, start))!
}

export { doSimpleMove, graphSearch, monsterGraphSearch }