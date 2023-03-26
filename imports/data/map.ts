import { EntityCategory, FacingDir } from "../core/interfaces"

const pacmanMap = [
    [5,1,11,1,1,1,1,4,0,0,0,5,1,1,1,1,11,1,4],
    [2,0,2,0,0,0,0,9,1,11,1,8,0,0,0,0,2,0,2],
    [7,1,3,1,1,11,1,6,0,2,0,7,1,11,1,1,3,1,6],
    [0,0,2,0,0,7,1,11,1,3,1,11,1,6,0,0,2,0,0],
    [0,0,2,0,0,0,0,2,0,2,0,2,0,0,0,0,2,0,0],
    [14,1,3,1,1,11,1,6,0,2,0,7,1,11,1,1,3,1,15],
    [0,0,2,0,0,2,0,0,5,10,4,0,0,2,0,0,2,0,0],
    [5,1,10,1,4,7,4,0,2,0,2,0,5,6,5,1,10,1,4],
    [2,0,0,0,9,1,3,1,10,1,10,1,3,1,8,0,0,0,2],
    [9,1,12,0,2,0,2,0,0,0,0,0,2,0,2,0,13,1,8],
    [2,0,0,0,9,1,10,1,1,1,1,1,10,1,8,0,0,0,2],
    [7,1,1,1,6,0,0,0,0,0,0,0,0,0,7,1,1,1,6]
]

interface EntityType {
    typeId: number
    category: EntityCategory
    spriteMapOffset: [number, number]
}

interface EntityData {
    id: number
    type: number
    startPos: [number, number]
    program?: FacingDir[]
}

const entityTypes: EntityType[] = [{
    typeId: 1,
    category: 'MONSTER',
    spriteMapOffset: [0, 1]
},{
    typeId: 2,
    category: 'MONSTER',
    spriteMapOffset: [4, 1]
},{
    typeId: 3,
    category: 'MONSTER',
    spriteMapOffset: [8, 1]
}]

const entities: EntityData[] = [{
    id: 1,
    type: 1,
    startPos: [3, 12],
    program: ['RIGHT','RIGHT','UP','UP','UP','UP','LEFT','LEFT','UP','UP',
        'UP','UP','UP','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','UP','UP','LEFT',
        'LEFT','LEFT','LEFT','LEFT','DOWN','UP','LEFT','LEFT','DOWN','DOWN','RIGHT','RIGHT',
        'DOWN','DOWN','DOWN','DOWN','DOWN','LEFT','LEFT','DOWN','DOWN','RIGHT',
        'RIGHT','LEFT','LEFT','DOWN','DOWN','RIGHT','RIGHT']
},{
    id: 2,
    type: 2,
    startPos: [13, 3],
    program: ['RIGHT','DOWN','LEFT','LEFT','DOWN','DOWN','RIGHT','RIGHT','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT',
        'RIGHT','RIGHT','RIGHT','UP','UP','RIGHT','RIGHT','UP','UP','RIGHT',
        'RIGHT','DOWN','RIGHT']
},{
    id: 3,
    type: 3,
    startPos: [17, 12],
    program: ['LEFT','LEFT','UP','LEFT','LEFT','LEFT','LEFT','LEFT','LEFT',
        'LEFT','LEFT','UP','UP','LEFT','LEFT','DOWN','DOWN','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','UP','UP','RIGHT',
        'RIGHT','DOWN','UP','UP','RIGHT','RIGHT','RIGHT','RIGHT','DOWN','DOWN','LEFT','LEFT',
        'RIGHT','RIGHT','DOWN','DOWN','LEFT','LEFT']
}]

export { pacmanMap, entityTypes, entities }