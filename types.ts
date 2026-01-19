
export enum UserRole {
  Admin = 'admin',
  CampusUser = 'campus_user',
}

export enum CampusId {
  Main = 'main',
  Johar = 'johar',
  Masjid = 'masjid',
  Maktab = 'maktab',
  ControlPanel = 'control_panel',
}

export enum TaskStatus {
  Assigned = 'assigned',
  InProgress = 'in_progress',
  Paused = 'paused',
  Completed = 'completed',
  Overdue = 'overdue'
}

export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Urgent = 'urgent'
}

export interface TimeSession {
  start: number;
  end?: number;
}

export interface User {
  id: number;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  campusId: CampusId;
  activeTaskId?: string; // Exclusivity rule
}

export interface AttendanceRecord {
  checkIn?: number;
  checkOut?: number;
  date: string; // YYYY-MM-DD
  totalWorkMinutes?: number;
}

export interface Task {
  id: string;
  description: string;
  isFixed: boolean;
  completed: boolean;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  estimatedMinutes: number;
  actualMinutes: number;
  timerStartedAt?: number;
  sessions: TimeSession[];
  // Date-driven reporting fields
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

export enum TaskCategory {
  Today = 'today',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export interface Bill {
  type: string;
  location: string;
  account: string;
  paid: boolean;
  attachment?: string;
}

export interface CampusData {
  tasks: {
    [TaskCategory.Today]: Task[];
    [TaskCategory.Daily]: Task[];
    [TaskCategory.Weekly]: Task[];
    [TaskCategory.Monthly]: Task[];
  };
  bills: Bill[];
  attendance: AttendanceRecord[];
}

export type AllCampusData = {
  [key: string]: CampusData;
};

export interface Theme {
  name: string;
  colors: {
    [key: string]: string;
  };
}
