const enum GameStatus {
    Created = 1,
    Running,
    OutOfTime,
    Finished
}

// Todo! Změna indexů - hra skončila byl 5 atd.
const GameStatusLabels = {
    1: 'Hra čeká na zahájení.',
    2: 'Hra právě probíhá.',
    3: 'Herní čas skončil. Jakmile zadáte posledí tahy, ukončete ji prosím.',
    4: 'Hra skončila.'
}

const enum TaskStatus {
    Issued = 1,
    Solved,
    Exchanged
}

export { GameStatus, TaskStatus, GameStatusLabels }