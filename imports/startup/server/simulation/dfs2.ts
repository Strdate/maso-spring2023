import { Pos } from "/imports/core/interfaces"
import { neighboursOf } from "/imports/core/utils/checkWallCollision"
import { formatPath } from "/imports/core/utils/misc"

type Path = { monsterCount: number, path: Pos[] }

class DFS_2 {

    explored: number[] = []
    monsterCount: number = 0
    teamMap: number[][]
    paths: Path[] = []

    constructor (teamMap: number[][]) {
        this.teamMap = teamMap
    }

    findPath = ({ start, excludeFirst }: { start: Pos, excludeFirst?: Pos }) => {
        this.run({ start, excludeFirst })
        this.paths.forEach(path => {if(path.monsterCount > 0) {
            path.path.forEach(seg => this.teamMap[seg[1]-1][seg[0]-1] += path.monsterCount)
        }})
        this.paths = []
        this.run({ start, excludeFirst })
        this.paths.sort((a, b) => a.monsterCount - b.monsterCount)
        const winner = this.paths[0]
        this.paths.forEach(path => console.log(`Monsters: ${path.monsterCount}, path: ${formatPath(path.path)}`))
        console.log(`Winner: Monsters: ${winner.monsterCount}, path: ${formatPath(winner.path)}`)
        return winner.path[1]
    }

    run = ({ start, excludeFirst }: { start: Pos, excludeFirst?: Pos }) => {
        const depth = this.explored.length
        this.explored.push(encode(start))
        this.monsterCount += this.teamMap[start[1]-1][start[0]-1]
        if(depth <= 10) {
            const neighbours = neighboursOf(start)
            neighbours
                .filter(n => !this.explored.includes(encode(n)) && (!excludeFirst || encode(n) !== encode(excludeFirst)))
                .forEach(n => {
                    this.run({ start: n })
                })
        } else {
            this.paths.push({ monsterCount: this.monsterCount, path: this.explored.map(pos => decode(pos)) })
        }
        this.monsterCount -= this.teamMap[start[1]-1][start[0]-1]
        this.explored.pop()
    }
}

function encode(pos: Pos) {
    return pos[0] + pos[1] * 100
}

function decode(num: number): Pos {
    return [num % 100,  Math.floor(num / 100)] 
}

export default DFS_2