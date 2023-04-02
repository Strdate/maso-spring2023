import { Game, GameCollection } from "/imports/api/collections/games";
import { Team, TeamsCollection } from "/imports/api/collections/teams";
import insertMove from "/imports/core/insertMove";
import { FacingDir, Pos } from "/imports/core/interfaces";
import updateTask from "/imports/core/updateTask";
import { getAllowedMoves } from "/imports/core/utils/checkWallCollision";
import { facingDirToMove, filterMoveByFacingDir, normalizePosition, vectorEq, vectorSum } from "/imports/core/utils/geometry";
import { formatPath } from "/imports/core/utils/misc";

const ROBOT_WORKER_ID = 'robotworkeruserid'

export default async function movePlayingRobots() {
    const now = new Date(new Date().setMilliseconds(0))
    const runningGames = getRunningGames(now)
    await Promise.all(runningGames.map(async game => {
        const robots = getRobots(game)
        robots.forEach((robot) => {
            try {
                solveRobotTask(robot, game)
                if (Math.random() > 0.5) {
                    return
                }
                doRandomMoves(robot, game, now)
            } catch(e) {
                console.log(`Error encountered for robot ${robot.number}`)
                throw e
            }
        })
    }))
}

function doRandomMoves(team: Team, game: Game, now: Date) {
    if(team.state !== 'PLAYING' && team.stateEndsAt!.getTime() > now.getTime()) {
        return
    }
    let previousMove: FacingDir | undefined
    const moves: Pos[] = []
    moves.push(team.position)
    for(let i = 0; i < Math.min(6, team.money); i++) {
        const facingDir = pickRandom(filterMoveByFacingDir(getAllowedMoves(team.position),previousMove))
        const newPos = vectorSum(facingDirToMove(facingDir), team.position)
        const normalizedPos = normalizePosition(newPos)
        if(checkForMonsters(normalizedPos, game)) {
            break
        }
        try {
            insertMove({
                gameId: game._id,
                teamId: team._id,
                newPos: newPos,
                isSimulation: false,
                userId: ROBOT_WORKER_ID
            })
        } catch {
            break
        }
        team.position = normalizedPos
        previousMove = facingDir
        moves.push(newPos)
    }
    if(moves.length > 1) {
        console.log(`Inserted moves for robot ${team.number}: ${formatPath(moves)}`)
    }
}

function checkForMonsters(pos: Pos, game: Game) {
    return game.entities.filter(ent => ent.category === 'MONSTER' && vectorEq(pos, ent.position)).length > 0
}

function getRunningGames(now: Date) {
    return GameCollection.find({
      startAt: { $lte: now },
      endAt: { $gte: now }
    }).fetch()
}

function getRobots(game: Game) {
    return TeamsCollection.find({ gameId: game._id, isBot: true }).fetch()
}

async function solveRobotTask(robot: Team, game: Game) {
    if (Math.random() > 0.5) {
        return
    }
    const issuedTasks = getRobotsIssuedTasks(robot, game)
    if (!issuedTasks || issuedTasks.length === 0) {
        console.log(`Robot ${robot.number} did not solve task: NO ISSUED`)
        return
    }
    const task = pickRandom(issuedTasks)
    updateTask({
        gameCode: game.code,
        teamNumber: parseInt(robot.number),
        userId: ROBOT_WORKER_ID,
        taskNumber: task,
        action: 'solve'
    })
    //logger.info(result)
    //console.log(`Robot ${robot.number} solved task: ${task}`)
}

function getRobotsIssuedTasks(robot: Team, game: Game) {
    const allTasks = getAllTaskNumbers(game)
    const filtered = allTasks.filter(t => !robot.solvedTasks.includes(t) && !robot.changedTasks.includes(t))
    return filtered.slice(0, game.initiallyIssuedTasks)
}

function getAllTaskNumbers(game: Game) {
return [...Array(game.totalTasksCount + 1).keys()].slice(1)
}
  
function pickRandom<T>(arr: Array<T>) {
    const index = Math.floor(Math.random() * arr.length)
    return arr[index]
  }