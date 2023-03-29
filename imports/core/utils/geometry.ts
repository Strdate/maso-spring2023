import { FacingDir, Pos } from "../interfaces"

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

export {
    vectorDiff,
    facingDirToMove,
    moveToFacingDir,
    vectorSum
}