import { FacingDir, Pos } from "../interfaces"
import { pacmanMap } from "/imports/data/map"

function vectorDiff(a: Pos, b: Pos): Pos {
    return [a[0] - b[0], a[1] - b[1]]
}

function facingDirToMove(facingDir: FacingDir): Pos {
    switch (facingDir) {
        case    'UP': return [  0, -1]
        case  'DOWN': return [  0,  1]
        case  'LEFT': return [ -1,  0]
        case 'RIGHT': return [  1,  0]
    }
}

function moveToFacingDir(move: Pos): FacingDir | undefined {
    if(move[0] === 0 && move[1] === -1) {
        return 'UP'
    } else if(move[0] === 0 && move[1] === 1) {
        return 'DOWN'
    } else if(move[0] === -1 && move[1] === 0) {
        return 'LEFT'
    } else if(move[0] === 1 && move[1] === 0) {
        return 'RIGHT'
    }
    return undefined
}

function vectorSum(a: Pos, b: Pos): Pos {
    return [a[0] + b[0], a[1] + b[1]]
}

function normalizePosition(pos: Pos): Pos {
    return [((pos[0] + pacmanMap[0].length - 1) % pacmanMap[0].length) + 1,
        ((pos[1] + pacmanMap.length - 1) % pacmanMap.length) + 1]
}

function vectorEq(a: Pos, b: Pos) {
    return (a[0] === b[0]) && (a[1] === b[1])
}

function filterMoveByFacingDir(moves: FacingDir[], facingDir?: FacingDir) {
    if(!facingDir) {
        return moves
    }
    if(moves.length <= 1) {
        return moves
    } 
    switch(facingDir) {
        case 'UP': return moves.filter(m => m !== 'DOWN')
        case 'DOWN': return moves.filter(m => m !== 'UP')
        case 'LEFT': return moves.filter(m => m !== 'RIGHT')
        case 'RIGHT': return moves.filter(m => m !== 'LEFT')
    }
}

export {
    vectorDiff,
    facingDirToMove,
    moveToFacingDir,
    vectorSum,
    normalizePosition,
    vectorEq,
    filterMoveByFacingDir
}