import { AllCampusData, User, Task, Bill, CampusId, TaskCategory } from '../types';
import { cloudStore } from './cloudStore';
import { INITIAL_DATA } from '../constants';

const FAKE_LATENCY = 150; // ms for simulated network delay

const syncChannel = new BroadcastChannel('dashboard-sync');

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getDb = (): AllCampusData => cloudStore.getData();
const saveDb = (data: AllCampusData) => {
  cloudStore.setData(data);
  syncChannel.postMessage({ type: 'DATA_UPDATED' });
};

const getUsersFromDb = (): User[] => cloudStore.getUsers();
const saveUsersToDb = (users: User[]) => {
    cloudStore.setUsers(users);
    syncChannel.postMessage({ type: 'USERS_UPDATED' });
}

export const databaseService = {
  async getAllData(): Promise<AllCampusData> {
    await delay(FAKE_LATENCY);
    return getDb();
  },

  async getAllUsers(): Promise<User[]> {
      await delay(FAKE_LATENCY);
      return getUsersFromDb();
  },

  // --- Task Mutations ---
  async toggleTask(campusId: CampusId, category: TaskCategory, taskId: string): Promise<AllCampusData> {
    await delay(FAKE_LATENCY / 2);
    const db = getDb();
    const campusData = db[campusId];
    if (campusData) {
      const newTasks = campusData.tasks[category].map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      db[campusId].tasks[category] = newTasks;
      saveDb(db);
    }
    return db;
  },

  async addTask(campusId: CampusId, category: TaskCategory, description: string): Promise<AllCampusData> {
    await delay(FAKE_LATENCY);
    const db = getDb();
    const campusData = db[campusId];
    if (campusData && description.trim()) {
        const newTask: Task = {
            id: `${campusId.substring(0,2).toUpperCase()}-${category.substring(0,1).toUpperCase()}-${Date.now()}`,
            description,
            isFixed: false,
            completed: false,
        };
        db[campusId].tasks[category].push(newTask);
        saveDb(db);
    }
    return db;
  },

  async deleteTask(campusId: CampusId, category: TaskCategory, taskId: string): Promise<AllCampusData> {
      await delay(FAKE_LATENCY);
      const db = getDb();
      const campusData = db[campusId];
      if (campusData) {
          db[campusId].tasks[category] = campusData.tasks[category].filter(t => t.id !== taskId);
          saveDb(db);
      }
      return db;
  },

  async toggleTaskFix(campusId: CampusId, category: TaskCategory, taskId: string): Promise<AllCampusData> {
      await delay(FAKE_LATENCY / 2);
      const db = getDb();
      const campusData = db[campusId];
      if (campusData) {
          db[campusId].tasks[category] = campusData.tasks[category].map(t =>
              t.id === taskId ? { ...t, isFixed: !t.isFixed } : t
          );
          saveDb(db);
      }
      return db;
  },

  async markAllTodayComplete(campusId: CampusId): Promise<AllCampusData> {
      await delay(FAKE_LATENCY);
      const db = getDb();
      const campusData = db[campusId];
      if (campusData) {
          db[campusId].tasks.today = campusData.tasks.today.map(t => ({...t, completed: true}));
          saveDb(db);
      }
      return db;
  },
  
  // --- Bill Mutations ---
  async toggleBill(campusId: CampusId, billIndex: number): Promise<AllCampusData> {
    await delay(FAKE_LATENCY / 2);
    const db = getDb();
    const campusData = db[campusId];
    if (campusData) {
        campusData.bills[billIndex].paid = !campusData.bills[billIndex].paid;
        saveDb(db);
    }
    return db;
  },

  async attachBill(campusId: CampusId, billIndex: number, fileUrl: string): Promise<AllCampusData> {
      await delay(FAKE_LATENCY);
      const db = getDb();
      const campusData = db[campusId];
      if (campusData) {
          campusData.bills[billIndex].attachment = fileUrl;
          saveDb(db);
      }
      return db;
  },

  async deleteAttachment(campusId: CampusId, billIndex: number): Promise<AllCampusData> {
      await delay(FAKE_LATENCY);
      const db = getDb();
      const campusData = db[campusId];
      if (campusData) {
          delete campusData.bills[billIndex].attachment;
          saveDb(db);
      }
      return db;
  },

  // --- Reset & Backup/Restore Mutations ---
  async resetCampus(campusId: CampusId): Promise<AllCampusData> {
      await delay(FAKE_LATENCY);
      const db = getDb();
      db[campusId] = JSON.parse(JSON.stringify(INITIAL_DATA[campusId]));
      saveDb(db);
      return db;
  },

  async resetAll(): Promise<AllCampusData> {
      await delay(FAKE_LATENCY * 2);
      cloudStore.reset();
      syncChannel.postMessage({ type: 'DATA_UPDATED' });
      syncChannel.postMessage({ type: 'USERS_UPDATED' });
      return cloudStore.getData();
  },

  async backupData(): Promise<void> {
    await delay(FAKE_LATENCY);
    const data = getDb();
    const users = getUsersFromDb();
    const backup = { data, users };
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `fiqh-academy-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  async restoreData(jsonContent: string): Promise<void> {
    if (!window.confirm("Are you sure you want to restore data? This will overwrite all current data.")) {
        return;
    }
    await delay(FAKE_LATENCY * 2);
    const backup = JSON.parse(jsonContent);
    if (backup && backup.data && backup.users) {
        cloudStore.setData(backup.data);
        cloudStore.setUsers(backup.users);
        syncChannel.postMessage({ type: 'DATA_UPDATED' });
        syncChannel.postMessage({ type: 'USERS_UPDATED' });
    } else {
        throw new Error("Invalid backup file format.");
    }
  },

  // --- User Mutations ---
  async addUser(newUser: Omit<User, 'id'>): Promise<User[]> {
      await delay(FAKE_LATENCY);
      const users = getUsersFromDb();
      const userWithId = { ...newUser, id: Date.now(), password: newUser.password || 'password' };
      users.push(userWithId);
      saveUsersToDb(users);
      return users;
  },

  async updateUser(updatedUser: User): Promise<User[]> {
      await delay(FAKE_LATENCY);
      const users = getUsersFromDb();
      const index = users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
          if (!updatedUser.password) {
              updatedUser.password = users[index].password;
          }
          users[index] = updatedUser;
          saveUsersToDb(users);
      }
      return users;
  },
  
  async deleteUser(userId: number): Promise<User[]> {
      await delay(FAKE_LATENCY);
      let users = getUsersFromDb();
      users = users.filter(u => u.id !== userId);
      saveUsersToDb(users);
      return users;
  }
};