import { Mongo } from 'meteor/mongo';

interface TaskChangeLog {
    userId: string;
    statusId: TaskStatus;
    createdAt: Date;
}

export interface Task {
    _id?: string;
    statusId: TaskStatus;
    number: number;
    teamId: string;
    gameId: string;
    isRevoked: boolean;
    changeLog: TaskChangeLog[];
    CreatedAt: Date;
    UpdatedAt: Date;
  }

export const TasksCollection = new Mongo.Collection<Task>('tasks');