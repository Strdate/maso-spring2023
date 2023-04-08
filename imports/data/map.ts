import { EntityCategory, FacingDir, Pos } from "../core/interfaces"

const pacmanMap = [
    [ 5, 1,11, 1, 1, 1, 4,-1,-1,-1, 5, 1, 1, 1,11, 1, 4],
    [ 2,-1, 2,-1,-1,-1, 9, 1, 1, 1, 8,-1,-1,-1, 2,-1, 2],
    [ 7, 1, 3, 1,11, 1, 6,-1, 0,-1, 7, 1,11, 1, 3, 1, 6],
    [-1,-1, 2,-1, 7, 1,11, 1,16, 1,11, 1, 6,-1, 2,-1,-1],
    [-1,-1, 2,-1,-1,-1, 2,-1, 2,-1, 2,-1,-1,-1, 2,-1,-1],
    [14, 1, 3, 1,11, 1, 6,-1, 2,-1, 7, 1,11, 1, 3, 1,15],
    [-1,-1, 2,-1, 2,-1,-1, 5,10, 4,-1,-1, 2,-1, 2,-1,-1],
    [ 5, 1,10, 4, 7, 4,-1, 2,-1, 2,-1, 5, 6, 5,10, 1, 4],
    [ 2,-1,-1, 9, 1, 3, 1,10, 1,10, 1, 3, 1, 8,-1,-1, 2],
    [ 9, 1,12, 2,-1, 2,-1,-1,-1,-1,-1, 2,-1, 2,13, 1, 8],
    [ 2,-1,-1, 9, 1,10, 1, 1, 1, 1, 1,10, 1, 8,-1,-1, 2],
    [ 7, 1, 1, 6,-1,-1,-1,-1,-1,-1,-1,-1,-1, 7, 1, 1, 6]
]

const playerStartPos: Pos = [9, 3]

//.reverse().map(n => n.map(m => {switch(m) { case 4: return 6; case 5: return 7; case 10: return 11; case 6: return 4; case 7: return 5; case 11: return 10; default: return m }}))

interface EntityType {
    typeId: number
    category: EntityCategory
    spriteMapOffset: Pos
    description?: string
    reward?: number
    isBoost?: boolean
}

interface EntityData {
    id: number
    type: number
    startPos: Pos
    program?: FacingDir[]
    facingDir?: FacingDir
}

interface SpawnSpot {
    letter: string
    position: Pos
}

interface ItemsData {
    id: number
    type: number
    spawnSpot: string
    spawnTime: number
}

const spawnSpots: SpawnSpot[] = [{
    letter: 'A',
    position: [1, 2]
},{
    letter: 'B',
    position: [5, 1]
},{
    letter: 'C',
    position: [9, 2]
},{
    letter: 'D',
    position: [13, 1]
},{
    letter: 'E',
    position: [17, 2]
},{
    letter: 'F',
    position: [3, 5]
},{
    letter: 'G',
    position: [6, 4]
},{
    letter: 'H',
    position: [12, 4]
},{
    letter: 'I',
    position: [15, 5]
},{
    letter: 'J',
    position: [5, 7]
},{
    letter: 'K',
    position: [8, 8]
},{
    letter: 'L',
    position: [10, 8]
},{
    letter: 'M',
    position: [13, 7]
},{
    letter: 'N',
    position: [3, 10]
},{
    letter: 'O',
    position: [2, 12]
},{
    letter: 'P',
    position: [4, 10]
},{
    letter: 'Q',
    position: [9, 11]
},{
    letter: 'R',
    position: [14, 10]
},{
    letter: 'S',
    position: [15, 10]
},{
    letter: 'T',
    position: [16, 12]
}]

const entityTypes: EntityType[] = [{
    typeId: 1,
    category: 'MONSTER',
    spriteMapOffset: [12, 2]
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
    typeId: 5,
    category: 'MONSTER',
    spriteMapOffset: [0, 1]
},{
    typeId: 6,
    category: 'MONSTER',
    spriteMapOffset: [8, 2]
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
    reward: 15
},{
    typeId: 9,
    category: 'ITEM',
    spriteMapOffset: [6, 2],
    description: 'Pohár',
    reward: 30
},{
    typeId: 10,
    category: 'ITEM',
    spriteMapOffset: [7, 2],
    description: 'Pytel zlaťáků',
    reward: 55
},{
    typeId: 11,
    category: 'ITEM',
    spriteMapOffset: [16, 1],
    description: 'Boost',
    isBoost: true,
    reward: 0
}/*,{
    typeId: 12,
    category: 'ITEM',
    spriteMapOffset: [0, 3],
    description: 'Eaten monster'
}*/]

const entities: EntityData[] = [{
    id: 1,
    type: 1,
    startPos: [4, 3],
    program: ['RIGHT','RIGHT','RIGHT','UP','UP','LEFT',
        'LEFT','LEFT','LEFT','DOWN','UP','LEFT','LEFT','DOWN','DOWN','RIGHT','RIGHT',
        'DOWN','DOWN','DOWN','DOWN','DOWN','LEFT','LEFT','DOWN','DOWN','RIGHT',
        'RIGHT','LEFT','LEFT','DOWN','DOWN','RIGHT','RIGHT','RIGHT','UP','UP','UP',
        'UP','LEFT','UP','UP','UP','UP','UP','RIGHT',]
},{
    id: 2,
    type: 2,
    startPos: [16, 3],
    program: ['LEFT','DOWN','DOWN','DOWN','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','UP','UP','LEFT','LEFT','UP',
        'RIGHT','RIGHT','UP','RIGHT','RIGHT','RIGHT','RIGHT','UP','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','DOWN','DOWN','LEFT']
},{
    id: 3,
    type: 3,
    startPos: [15, 12],
    program: ['LEFT','UP','LEFT','LEFT','LEFT','LEFT','LEFT','LEFT',
        'LEFT','LEFT','UP','UP','LEFT','LEFT','DOWN','DOWN','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','UP','UP','RIGHT',
        'RIGHT','DOWN','UP','UP','RIGHT','RIGHT','RIGHT','DOWN','DOWN','LEFT','LEFT',
        'RIGHT','RIGHT','DOWN','DOWN','LEFT','LEFT']
},{
    id: 4,
    type: 4,
    startPos: [9, 6],
    program: ['DOWN','LEFT','DOWN','DOWN','LEFT','RIGHT','RIGHT','RIGHT','RIGHT',
        'RIGHT','UP','RIGHT','UP','UP','RIGHT','RIGHT','DOWN','UP','UP',
        'UP','UP','UP','DOWN','LEFT','LEFT','DOWN','LEFT','LEFT','LEFT',
        'LEFT','DOWN','DOWN']
},{
    id: 5,
    type: 5,
    startPos: [5, 6],
    facingDir: 'RIGHT'
},{
    id: 6,
    type: 6,
    startPos: [6, 11],
    facingDir: 'RIGHT'
}]

const items: ItemsData[] = [
    { "id": 11, "spawnSpot": "I", "type": 9, "spawnTime": 0 },
    { "id": 12, "spawnSpot": "G", "type": 7, "spawnTime": 0 },
    { "id": 13, "spawnSpot": "P", "type": 8, "spawnTime": 0 },
    { "id": 14, "spawnSpot": "N", "type": 10, "spawnTime": 4 },
    { "id": 15, "spawnSpot": "E", "type": 8, "spawnTime": 4 },
    { "id": 16, "spawnSpot": "R", "type": 7, "spawnTime": 4 },
    { "id": 17, "spawnSpot": "T", "type": 9, "spawnTime": 8 },
    { "id": 18, "spawnSpot": "L", "type": 7, "spawnTime": 8 },
    { "id": 19, "spawnSpot": "D", "type": 8, "spawnTime": 8 },
    { "id": 20, "spawnSpot": "C", "type": 11, "spawnTime": 12 },
    { "id": 21, "spawnSpot": "F", "type": 7, "spawnTime": 12 },
    { "id": 22, "spawnSpot": "M", "type": 8, "spawnTime": 12 },
    { "id": 23, "spawnSpot": "Q", "type": 9, "spawnTime": 16 },
    { "id": 24, "spawnSpot": "B", "type": 8, "spawnTime": 16 },
    { "id": 25, "spawnSpot": "H", "type": 7, "spawnTime": 16 },
    { "id": 26, "spawnSpot": "S", "type": 10, "spawnTime": 20 },
    { "id": 27, "spawnSpot": "O", "type": 9, "spawnTime": 20 },
    { "id": 28, "spawnSpot": "K", "type": 7, "spawnTime": 20 },
    { "id": 29, "spawnSpot": "F", "type": 11, "spawnTime": 24 },
    { "id": 30, "spawnSpot": "J", "type": 7, "spawnTime": 24 },
    { "id": 31, "spawnSpot": "H", "type": 8, "spawnTime": 24 },
    { "id": 32, "spawnSpot": "C", "type": 9, "spawnTime": 28 },
    { "id": 33, "spawnSpot": "K", "type": 7, "spawnTime": 28 },
    { "id": 34, "spawnSpot": "P", "type": 7, "spawnTime": 28 },
    { "id": 35, "spawnSpot": "A", "type": 11, "spawnTime": 32 },
    { "id": 36, "spawnSpot": "M", "type": 8, "spawnTime": 32 },
    { "id": 37, "spawnSpot": "D", "type": 7, "spawnTime": 32 },
    { "id": 38, "spawnSpot": "G", "type": 7, "spawnTime": 36},
    { "id": 39, "spawnSpot": "R", "type": 8, "spawnTime": 36},
    { "id": 40, "spawnSpot": "O", "type": 7, "spawnTime": 36},
    { "id": 41, "spawnSpot": "N", "type": 10, "spawnTime": 40},
    { "id": 42, "spawnSpot": "S", "type": 11, "spawnTime": 40},
    { "id": 43, "spawnSpot": "E", "type": 7, "spawnTime": 40},
    { "id": 44, "spawnSpot": "I", "type": 7, "spawnTime": 44},
    { "id": 45, "spawnSpot": "A", "type": 9, "spawnTime": 44},
    { "id": 46, "spawnSpot": "L", "type": 8, "spawnTime": 44},
    { "id": 47, "spawnSpot": "T", "type": 7, "spawnTime": 48},
    { "id": 48, "spawnSpot": "J", "type": 7, "spawnTime": 48},
    { "id": 49, "spawnSpot": "D", "type": 9, "spawnTime": 48},
    { "id": 50, "spawnSpot": "K", "type": 8, "spawnTime": 52},
    { "id": 51, "spawnSpot": "R", "type": 8, "spawnTime": 52},
    { "id": 52, "spawnSpot": "C", "type": 7, "spawnTime": 52},
    { "id": 53, "spawnSpot": "G", "type": 7, "spawnTime": 56},
    { "id": 54, "spawnSpot": "I", "type": 9, "spawnTime": 56},
    { "id": 55, "spawnSpot": "Q", "type": 10, "spawnTime": 56},
    { "id": 56, "spawnSpot": "P", "type": 7, "spawnTime": 60},
    { "id": 57, "spawnSpot": "B", "type": 8, "spawnTime": 60},
    { "id": 58, "spawnSpot": "H", "type": 7, "spawnTime": 60},
    { "id": 59, "spawnSpot": "E", "type": 11, "spawnTime": 64},
    { "id": 60, "spawnSpot": "F", "type": 9, "spawnTime": 64},
    { "id": 61, "spawnSpot": "L", "type": 7, "spawnTime": 64},
    { "id": 62, "spawnSpot": "S", "type": 9, "spawnTime": 68},
    { "id": 63, "spawnSpot": "O", "type": 7, "spawnTime": 68},
    { "id": 64, "spawnSpot": "A", "type": 7, "spawnTime": 68},
    { "id": 65, "spawnSpot": "J", "type": 10, "spawnTime": 72},
    { "id": 66, "spawnSpot": "M", "type": 8, "spawnTime": 72},
    { "id": 67, "spawnSpot": "Q", "type": 7, "spawnTime": 72},
    { "id": 68, "spawnSpot": "B", "type": 8, "spawnTime": 76},
    { "id": 69, "spawnSpot": "N", "type": 8, "spawnTime": 76},
    { "id": 70, "spawnSpot": "T", "type": 7, "spawnTime": 76},
]

export { pacmanMap, playerStartPos, entityTypes, spawnSpots, items, entities,
    ItemsData }