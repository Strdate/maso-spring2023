const ROBOT_WORKER_ID = 'robotworkeruserid'
const INITIAL_SETUP_USER_ID = "initialsetupuserid";

const enum GameStatus {
    Created = 1,
    Running,
    OutOfTime,
    Finished,
    Published
}

// Todo! Změna indexů - hra skončila byl 5 atd.
const GameStatusLabels = {
    1: 'Hra čeká na zahájení.',
    2: 'Hra právě probíhá.',
    3: 'Herní čas skončil. Jakmile zadáte posledí tahy, ukončete ji prosím.',
    4: 'Hra skončila.',
    5: 'Hra skončila a byla publikována.'
}

const enum TaskStatus {
    Issued = 1,
    Solved,
    Exchanged
}

export { GameStatus, TaskStatus, GameStatusLabels, ROBOT_WORKER_ID, INITIAL_SETUP_USER_ID }