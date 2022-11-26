const enum GameStatus {
    Created = 1,
    Running,
    OutOfTime,
    Finished
}

const enum TaskStatus {
    Issued = 1,
    Solved,
    Exchanged
}

export { GameStatus, TaskStatus }