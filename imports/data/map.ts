import { EntityCategory, FacingDir, Pos } from "../core/interfaces"

const pacmanMap = [
    [5,1,11,1,1,1,1,4,-1,-1,-1,5,1,1,1,1,11,1,4],
    [2,-1,2,-1,-1,-1,-1,9,1,1,1,8,-1,-1,-1,-1,2,-1,2],
    [7,1,3,1,1,11,1,6,-1,0,-1,7,1,11,1,1,3,1,6],
    [-1,-1,2,-1,-1,7,1,11,1,3,1,11,1,6,-1,-1,2,-1,-1],
    [-1,-1,2,-1,-1,-1,-1,2,-1,2,-1,2,-1,-1,-1,-1,2,-1,-1],
    [14,1,3,1,1,11,1,6,-1,2,-1,7,1,11,1,1,3,1,15],
    [-1,-1,2,-1,-1,2,-1,-1,5,10,4,-1,-1,2,-1,-1,2,-1,-1],
    [5,1,10,1,4,7,4,-1,2,-1,2,-1,5,6,5,1,10,1,4],
    [2,-1,-1,-1,9,1,3,1,10,1,10,1,3,1,8,-1,-1,-1,2],
    [9,1,12,-1,2,-1,2,-1,-1,-1,-1,-1,2,-1,2,-1,13,1,8],
    [2,-1,-1,-1,9,1,10,1,1,1,1,1,10,1,8,-1,-1,-1,2],
    [7,1,1,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,1,1,1,6]
] as const

const playerStartPos: Readonly<Pos> = [10, 3]

//.reverse().map(n => n.map(m => {switch(m) { case 4: return 6; case 5: return 7; case 10: return 11; case 6: return 4; case 7: return 5; case 11: return 10; default: return m }}))

interface EntityType {
    typeId: number
    category: EntityCategory
    spriteMapOffset: Readonly<Pos>
    description?: string
    reward?: number
}

interface EntityData {
    id: number
    type: number
    startPos: Readonly<Pos>
    program?: Readonly<FacingDir[]>
}

interface SpawnSpot {
    id: number
    position: Readonly<Pos>
}

interface ItemsData {
    id: number
    type: number
    spawnSpotId: number
    spawnTime: number
}

const spawnSpots: Readonly<SpawnSpot[]> = [{
    id: 1,
    position: [1, 2]
},{
    id: 2,
    position: [6, 1]
},{
    id: 3,
    position: [7, 4]
},{
    id: 4,
    position: [14, 7]
}] as const

const entityTypes: Readonly<EntityType[]> = [{
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
},{
    typeId: 4,
    category: 'MONSTER',
    spriteMapOffset: [12, 1]
},{
    typeId: 7,
    category: 'ITEM',
    spriteMapOffset: [4, 2],
    description: 'Třešně',
    reward: 10
},{
    typeId: 8,
    category: 'ITEM',
    spriteMapOffset: [5, 2],
    description: 'Mince',
    reward: 20
},{
    typeId: 9,
    category: 'ITEM',
    spriteMapOffset: [6, 2],
    description: 'Pohár',
    reward: 35
},{
    typeId: 10,
    category: 'ITEM',
    spriteMapOffset: [7, 2],
    description: 'Pytel zlata',
    reward: 60
}] as const

const entities: Readonly<EntityData[]> = [{
    id: 1,
    type: 1,
    startPos: [5, 3],
    program: ['RIGHT','RIGHT','RIGHT','UP','UP','LEFT',
        'LEFT','LEFT','LEFT','LEFT','DOWN','UP','LEFT','LEFT','DOWN','DOWN','RIGHT','RIGHT',
        'DOWN','DOWN','DOWN','DOWN','DOWN','LEFT','LEFT','DOWN','DOWN','RIGHT',
        'RIGHT','LEFT','LEFT','DOWN','DOWN','RIGHT','RIGHT','RIGHT','RIGHT','UP','UP','UP',
        'UP','LEFT','LEFT','UP','UP','UP','UP','UP','RIGHT','RIGHT']
},{
    id: 2,
    type: 2,
    startPos: [17, 3],
    program: ['DOWN','DOWN','DOWN','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','UP','UP','LEFT','LEFT','UP',
        'RIGHT','RIGHT','UP','RIGHT','RIGHT','RIGHT','RIGHT','UP','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','DOWN','DOWN','LEFT','LEFT']
},{
    id: 3,
    type: 3,
    startPos: [17, 12],
    program: ['LEFT','LEFT','UP','LEFT','LEFT','LEFT','LEFT','LEFT','LEFT',
        'LEFT','LEFT','UP','UP','LEFT','LEFT','DOWN','DOWN','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','UP','UP','RIGHT',
        'RIGHT','DOWN','UP','UP','RIGHT','RIGHT','RIGHT','RIGHT','DOWN','DOWN','LEFT','LEFT',
        'RIGHT','RIGHT','DOWN','DOWN','LEFT','LEFT']
},{
    id: 4,
    type: 4,
    startPos: [10, 6],
    program: ['DOWN','LEFT','DOWN','DOWN','LEFT','RIGHT','RIGHT','RIGHT','RIGHT',
        'RIGHT','UP','RIGHT','UP','UP','RIGHT','RIGHT','RIGHT','DOWN','UP','UP',
        'UP','UP','UP','DOWN','LEFT','LEFT','LEFT','DOWN','LEFT','LEFT','LEFT',
        'LEFT','DOWN','DOWN']
}] as const

const items: Readonly<ItemsData[]> = [{
    id: 1,
    type: 7,
    spawnSpotId: 1,
    spawnTime: 0
},{
    id: 2,
    type: 7,
    spawnSpotId: 2,
    spawnTime: 8
},{
    id: 3,
    type: 8,
    spawnSpotId: 3,
    spawnTime: 0
},{
    id: 4,
    type: 8,
    spawnSpotId: 4,
    spawnTime: 4
},{
    id: 5,
    type: 9,
    spawnSpotId: 1,
    spawnTime: 12
},{
    id: 6,
    type: 10,
    spawnSpotId: 3,
    spawnTime: 8
},{
    id: 7,
    type: 10,
    spawnSpotId: 4,
    spawnTime: 12
}] as const

export { pacmanMap, playerStartPos, entityTypes, spawnSpots, items, entities }