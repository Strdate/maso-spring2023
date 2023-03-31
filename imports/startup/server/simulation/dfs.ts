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

    run = (start: Pos, excludeFirst?: Pos) => {
        if(this.explored.length > 10) {
            return
        }
        this.explored.push(encode(start))
        this.sum += this.teamMap[start[1]-1][start[0]-1]
        neighboursOf(start)
            .filter(n => !this.explored.includes(encode(n)) && (!excludeFirst || encode(n) !== encode(excludeFirst)))
            .forEach(n => {
                this.run(n)
            })
        if(this.sum > this.longsetPath.sum) {
            this.longsetPath = { path: this.explored.map(e => decode(e)), sum: this.sum }
        }
        this.sum -= this.teamMap[start[1]-1][start[0]-1]
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