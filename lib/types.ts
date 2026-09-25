export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  color: string;
  owner: User;
  members: string[] | User[];
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  workspace: string;
  owner: string;
  members: User[];
  columns: Column[];
  createdAt: string;
}

export type Priority = "low" | "medium" | "high" | "urgent";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: string;
  status: string;
  priority: Priority;
  order: number;
  assignees: User[];
  dueDate: string | null;
  labels: string[];
  createdBy: User | string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  task: string;
  author: User;
  text: string;
  createdAt: string;
}

export interface ActivityEntry {
  _id: string;
  project: string;
  task?: string | null;
  actor: User;
  action: string;
  meta: Record<string, any>;
  createdAt: string;
}
