import { Pos } from "../interfaces";

function formatPath(path: Pos[]) {
    return path.map(n => `[${n[0]},${n[1]}]`).join(' -> ')
}

export { formatPath }