import { Pos } from "/imports/core/interfaces"
import { neighboursOf } from "/imports/core/utils/checkWallCollision"

class DFS {

    explored: number[] = []
    sum: number = 0
    teamMap: number[][]
    longsetPath: { sum: number, path: Pos[] } = { sum: -1, path: [] }

    constructor (teamMap: number[][]) {
        this.teamMap = teamMap
    }

    run = ({ start, excludeFirst, visited }: { start: Pos, excludeFirst?: Pos, visited?: boolean }) => {
        const depth = this.explored.length
        if(depth > 10) {
            return
        }
        this.explored.push(encode(start))
        this.sum += visited ? 0 : this.teamMap[start[1]-1][start[0]-1] * (depth < 3 ? 2 : 1)
        const neighbours = neighboursOf(start)
        neighbours
            .filter(n => (neighbours.length > 1 && (!excludeFirst || encode(n) !== encode(excludeFirst))))
            .forEach(n => {
                this.run({ start: n, visited: this.explored.includes(encode(n)), excludeFirst: start })
            })
        if(this.sum > this.longsetPath.sum) {
            this.longsetPath = { path: this.explored.map(e => decode(e)), sum: this.sum }
        }
        this.sum -= visited ? 0 : this.teamMap[start[1]-1][start[0]-1]
        this.explored.pop()
    }
}

function encode(pos: Pos) {
    return pos[0] + pos[1] * 100
}

function decode(num: number): Pos {
    return [num % 100,  Math.floor(num / 100)] 
}

export default DFS