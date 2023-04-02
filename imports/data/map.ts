import { EntityCategory, FacingDir, Pos } from "../core/interfaces"

const pacmanMap = [
    [5,1,11,1,1,1,1,4,-1,-1,-1,5,1,1,1,1,11,1,4],
    [2,-1,2,-1,-1,-1,-1,9,1,1,1,8,-1,-1,-1,-1,2,-1,2],
    [7,1,3,1,1,11,1,6,-1,0,-1,7,1,11,1,1,3,1,6],
    [-1,-1,2,-1,-1,7,1,11,1,16,1,11,1,6,-1,-1,2,-1,-1],
    [-1,-1,2,-1,-1,-1,-1,2,-1,2,-1,2,-1,-1,-1,-1,2,-1,-1],
    [14,1,3,1,1,11,1,6,-1,2,-1,7,1,11,1,1,3,1,15],
    [-1,-1,2,-1,-1,2,-1,-1,5,10,4,-1,-1,2,-1,-1,2,-1,-1],
    [5,1,10,1,4,7,4,-1,2,-1,2,-1,5,6,5,1,10,1,4],
    [2,-1,-1,-1,9,1,3,1,10,1,10,1,3,1,8,-1,-1,-1,2],
    [9,1,12,-1,2,-1,2,-1,-1,-1,-1,-1,2,-1,2,-1,13,1,8],
    [2,-1,-1,-1,9,1,10,1,1,1,1,1,10,1,8,-1,-1,-1,2],
    [7,1,1,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,7,1,1,1,6]
]

const playerStartPos: Pos = [10, 3]

//.reverse().map(n => n.map(m => {switch(m) { case 4: return 6; case 5: return 7; case 10: return 11; case 6: return 4; case 7: return 5; case 11: return 10; default: return m }}))

interface EntityType {
    typeId: number
    category: EntityCategory
    spriteMapOffset: Pos
    description?: string
    reward?: number
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
    position: [6, 1]
},{
    letter: 'C',
    position: [10, 2]
},{
    letter: 'D',
    position: [14, 1]
},{
    letter: 'E',
    position: [19, 2]
},{
    letter: 'F',
    position: [3, 5]
},{
    letter: 'G',
    position: [7, 4]
},{
    letter: 'H',
    position: [13, 4]
},{
    letter: 'I',
    position: [17, 5]
},{
    letter: 'J',
    position: [6, 7]
},{
    letter: 'K',
    position: [9, 8]
},{
    letter: 'L',
    position: [11, 8]
},{
    letter: 'M',
    position: [14, 7]
},{
    letter: 'N',
    position: [3, 10]
},{
    letter: 'O',
    position: [3, 12]
},{
    letter: 'P',
    position: [5, 10]
},{
    letter: 'Q',
    position: [10, 11]
},{
    letter: 'R',
    position: [15, 10]
},{
    letter: 'S',
    position: [17, 10]
},{
    letter: 'T',
    position: [17, 12]
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
    reward: 50
},{
    typeId: 10,
    category: 'ITEM',
    spriteMapOffset: [16, 1],
    description: 'Powerup',
    reward: 0
}]

const entities: EntityData[] = [{
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
    startPos: [18, 3],
    program: ['LEFT','DOWN','DOWN','DOWN','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','UP','UP','LEFT','LEFT','UP',
        'RIGHT','RIGHT','UP','RIGHT','RIGHT','RIGHT','RIGHT','UP','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','DOWN','DOWN','LEFT']
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
},{
    id: 5,
    type: 5,
    startPos: [5, 6],
    facingDir: 'RIGHT'
}]

const items: ItemsData[] = [
    { "id": 11, "spawnSpot": "Q", "type": 8, "spawnTime": 0 },
    { "id": 12, "spawnSpot": "I", "type": 9, "spawnTime": 0 },
    { "id": 13, "spawnSpot": "G", "type": 7, "spawnTime": 0 },
    { "id": 14, "spawnSpot": "N", "type": 10, "spawnTime": 4 },
    { "id": 15, "spawnSpot": "R", "type": 8, "spawnTime": 4 },
    { "id": 16, "spawnSpot": "C", "type": 7, "spawnTime": 4 },
    { "id": 17, "spawnSpot": "F", "type": 9, "spawnTime": 8 },
    { "id": 18, "spawnSpot": "K", "type": 7, "spawnTime": 8 },
    { "id": 19, "spawnSpot": "M", "type": 7, "spawnTime": 8 },
    { "id": 20, "spawnSpot": "I", "type": 8, "spawnTime": 12 },
    { "id": 21, "spawnSpot": "T", "type": 11, "spawnTime": 12 },
    { "id": 22, "spawnSpot": "B", "type": 7, "spawnTime": 12 },
    { "id": 23, "spawnSpot": "H", "type": 7, "spawnTime": 16 },
    { "id": 24, "spawnSpot": "L", "type": 7, "spawnTime": 16 },
    { "id": 25, "spawnSpot": "P", "type": 9, "spawnTime": 16 },
    { "id": 26, "spawnSpot": "J", "type": 9, "spawnTime": 20 },
    { "id": 27, "spawnSpot": "A", "type": 9, "spawnTime": 20 },
    { "id": 28, "spawnSpot": "E", "type": 10, "spawnTime": 20 },
    { "id": 29, "spawnSpot": "S", "type": 11, "spawnTime": 24 },
    { "id": 30, "spawnSpot": "O", "type": 8, "spawnTime": 24 },
    { "id": 31, "spawnSpot": "I", "type": 7, "spawnTime": 24 },
    { "id": 32, "spawnSpot": "D", "type": 7, "spawnTime": 28 },
    { "id": 33, "spawnSpot": "F", "type": 7, "spawnTime": 28 },
    { "id": 34, "spawnSpot": "P", "type": 8, "spawnTime": 28 },
    { "id": 35, "spawnSpot": "J", "type": 8, "spawnTime": 32 },
    { "id": 36, "spawnSpot": "E", "type": 7, "spawnTime": 32 },
    { "id": 37, "spawnSpot": "B", "type": 9, "spawnTime": 32 },
    {"id": 38, "spawnSpot": "M", "type": 8, "spawnTime": 36},
    {"id": 39, "spawnSpot": "R", "type": 7, "spawnTime": 36},
    {"id": 40, "spawnSpot": "G", "type": 7, "spawnTime": 36},
    {"id": 41, "spawnSpot": "N", "type": 10, "spawnTime": 40},
    {"id": 42, "spawnSpot": "S", "type": 11, "spawnTime": 40},
    {"id": 43, "spawnSpot": "H", "type": 7, "spawnTime": 40},
    {"id": 44, "spawnSpot": "D", "type": 9, "spawnTime": 44},
    {"id": 45, "spawnSpot": "K", "type": 7, "spawnTime": 44},
    {"id": 46, "spawnSpot": "F", "type": 8, "spawnTime": 44},
    {"id": 47, "spawnSpot": "Q", "type": 9, "spawnTime": 48},
    {"id": 48, "spawnSpot": "A", "type": 11, "spawnTime": 48},
    {"id": 49, "spawnSpot": "L", "type": 7, "spawnTime": 48},
    {"id": 50, "spawnSpot": "C", "type": 8, "spawnTime": 52},
    {"id": 51, "spawnSpot": "H", "type": 7, "spawnTime": 52},
    {"id": 52, "spawnSpot": "R", "type": 8, "spawnTime": 52},
    {"id": 53, "spawnSpot": "T", "type": 7, "spawnTime": 56},
    {"id": 54, "spawnSpot": "O", "type": 10, "spawnTime": 56},
    {"id": 55, "spawnSpot": "E", "type": 9, "spawnTime": 56},
    {"id": 56, "spawnSpot": "P", "type": 7, "spawnTime": 60},
    {"id": 57, "spawnSpot": "G", "type": 7, "spawnTime": 60},
    {"id": 58, "spawnSpot": "L", "type": 8, "spawnTime": 60},
    {"id": 59, "spawnSpot": "B", "type": 7, "spawnTime": 64},
    {"id": 60, "spawnSpot": "Q", "type": 9, "spawnTime": 64},
    {"id": 61, "spawnSpot": "C", "type": 11, "spawnTime": 64},
    {"id": 62, "spawnSpot": "K", "type": 7, "spawnTime": 68},
    {"id": 63, "spawnSpot": "M", "type": 8, "spawnTime": 68},
    {"id": 64, "spawnSpot": "A", "type": 9, "spawnTime": 68},
    {"id": 65, "spawnSpot": "S", "type": 10, "spawnTime": 72},
    {"id": 66, "spawnSpot": "N", "type": 8, "spawnTime": 72},
    {"id": 67, "spawnSpot": "J", "type": 7, "spawnTime": 72},
    {"id": 68, "spawnSpot": "T", "type": 7, "spawnTime": 76},
    {"id": 69, "spawnSpot": "O", "type": 8, "spawnTime": 76},
    {"id": 70, "spawnSpot": "D", "type": 8, "spawnTime": 76},
]

export { pacmanMap, playerStartPos, entityTypes, spawnSpots, items, entities }

/*

type Pos = [number, number]

type FacingDir = 'UP' | 'DOWN' | 'RIGHT' | 'LEFT'

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

const spawnSpots: SpawnSpot[] = [{
    letter: 'A',
    position: [1, 2]
},{
    letter: 'B',
    position: [6, 1]
},{
    letter: 'C',
    position: [10, 2]
},{
    letter: 'D',
    position: [14, 1]
},{
    letter: 'E',
    position: [19, 2]
},{
    letter: 'F',
    position: [3, 5]
},{
    letter: 'G',
    position: [7, 4]
},{
    letter: 'H',
    position: [13, 4]
},{
    letter: 'I',
    position: [17, 5]
},{
    letter: 'J',
    position: [6, 7]
},{
    letter: 'K',
    position: [9, 8]
},{
    letter: 'L',
    position: [11, 8]
},{
    letter: 'M',
    position: [14, 7]
},{
    letter: 'N',
    position: [3, 10]
},{
    letter: 'O',
    position: [3, 12]
},{
    letter: 'P',
    position: [5, 10]
},{
    letter: 'Q',
    position: [10, 11]
},{
    letter: 'R',
    position: [15, 10]
},{
    letter: 'S',
    position: [17, 10]
},{
    letter: 'T',
    position: [17, 12]
}]

const entities: EntityData[] = [{
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
    startPos: [18, 3],
    program: ['LEFT','DOWN','DOWN','DOWN','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','UP','UP','LEFT','LEFT','UP',
        'RIGHT','RIGHT','UP','RIGHT','RIGHT','RIGHT','RIGHT','UP','RIGHT',
        'RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','RIGHT','DOWN','DOWN','LEFT']
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
}]

function facingDirToMove(facingDir: FacingDir): Pos {
    switch (facingDir) {
        case    'UP': return [  0, -1]
        case  'DOWN': return [  0,  1]
        case  'LEFT': return [ -1,  0]
        case 'RIGHT': return [  1,  0]
    }
}

function normalizePosition(pos: Pos): Pos {
    return [((pos[0] + 19 - 1) % 19) + 1,
        ((pos[1] + 12 - 1) % 12) + 1]
}

function vectorSum(a: Pos, b: Pos): Pos {
    return [a[0] + b[0], a[1] + b[1]]
}

function vectorEq(a: Pos, b: Pos) {
    return (a[0] === b[0]) && (a[1] === b[1])
}

function aggregatePosition(program: FacingDir[], tick: number) {
    let agg: Pos = [0, 0]
    const modTick = tick % program.length
    for(let i = 0; i <= modTick; i++) {
        agg = vectorSum(agg, facingDirToMove(program[i]))
    }
    return agg
}

const GAME_LENGTH_MIN = 80
const hits: { time: number, pos: Pos, entId: number, ss: string }[] = []

for(let i = 0; i < GAME_LENGTH_MIN * 3; i++) {
    entities.forEach((ent) => {
        const pos = normalizePosition(vectorSum(aggregatePosition(ent.program!, i), ent.startPos))
        spawnSpots.forEach((ss) => {
            if(vectorEq(ss.position,pos)) {
                hits.push({ time: i, pos, entId: ent.id, ss: ss.letter })
            }
        })
    })
}

hits.forEach((hit) => console.log(`Time: ${hit.time}; ${Math.ceil(hit.time/3)}; ${hit.ss} [${hit.pos[0]},${hit.pos[1]}], monster: ${hit.entId} `))
console.log(JSON.stringify(hits))

*/