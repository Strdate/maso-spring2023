import { TaskStatus } from "./enums";

type Pos = [number, number]

interface MeteorMethodBase {
  isSimulation: boolean,
  userId: string | null
}

interface TeamScore {
    tasks: number;
    items: number;
    total: number;
}

interface EntityInstance {
    id: number
    category: EntityCategory
    spriteMapOffset: [number, number]
    position: [number, number]
    facingDir?: FacingDir
    flashing?: boolean
  }

type EntityCategory = 'MONSTER' | 'PACMAN' | 'ITEM'

type FacingDir = 'UP' | 'DOWN' | 'RIGHT' | 'LEFT'

const TaskActionsArr = ['solve', 'exchange', 'cancel'] as const
type TaskTuple = typeof TaskActionsArr;
type TaskActionString = TaskTuple[number];

interface TaskBase {
  teamNumber: number,
  taskNumber: number,
  action: TaskActionString
}

interface TaskInput extends TaskBase {
  gameCode: string
}

interface TaskInputWithUser extends TaskInput {
  userId: string
}

interface TaskReturnData {
  teamNumber: string
  teamName: string
  taskNumber: number,
  taskStatusId: TaskStatus,
  print: boolean,
  printNumber: number | null,
}

export {
  Pos,
  MeteorMethodBase,
  TeamScore,
  EntityInstance,
  EntityCategory,
  FacingDir,
  TaskBase,
  TaskInput,
  TaskInputWithUser,
  TaskActionString,
  TaskReturnData,
  TaskActionsArr
}