import { Mongo } from 'meteor/mongo';
import { TaskStatus } from '/imports/core/enums';

interface TaskChangeLog {
    userId: string;
    statusId: TaskStatus;
    createdAt: Date;
}

export interface Task {
    _id: string;
    statusId: TaskStatus;
    number: number;
    teamId: string;
    gameId: string;
    isRevoked: boolean;
    changeLog: TaskChangeLog[];
    createdAt: Date;
    updatedAt: Date;
  }

export const TasksCollection = new Mongo.Collection<Task>('tasks');