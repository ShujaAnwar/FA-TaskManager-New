
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

export interface User {
  id: number;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  campusId: CampusId;
}

export interface Task {
  id: string;
  description: string;
  isFixed: boolean;
  completed: boolean;
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
