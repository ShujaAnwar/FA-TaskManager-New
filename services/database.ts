
import { AllCampusData, User, Task, Bill, CampusId, TaskCategory, TaskStatus, AttendanceRecord, Priority } from '../types';
import { cloudStore } from './cloudStore';
import { INITIAL_DATA } from '../constants';

const FAKE_LATENCY = 30; 
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
    let data = getDb();
    let migrated = false;

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      data = JSON.parse(JSON.stringify(INITIAL_DATA));
      saveDb(data);
      return data;
    }

    Object.keys(data).forEach(cid => {
        const campus = data[cid];
        if (!campus || typeof campus !== 'object') return;

        if (!campus.attendance) { campus.attendance = []; migrated = true; }
        if (!campus.tasks) { 
          campus.tasks = { today: [], daily: [], weekly: [], monthly: [] }; 
          migrated = true; 
        }
        
        if (!campus.bills) { campus.bills = []; migrated = true; }

        Object.keys(campus.tasks).forEach(cat => {
            const taskList = campus.tasks[cat as TaskCategory];
            if (!Array.isArray(taskList)) {
              campus.tasks[cat as TaskCategory] = [];
              migrated = true;
              return;
            }
            
            taskList.forEach((t: any) => {
                if (t && typeof t === 'object') {
                    if (!t.sessions) { t.sessions = []; migrated = true; }
                    if (t.priority === undefined) { t.priority = Priority.Medium; migrated = true; }
                    if (t.status === undefined) { 
                      t.status = t.completed ? TaskStatus.Completed : TaskStatus.Assigned; 
                      migrated = true; 
                    }
                    if (t.actualMinutes === undefined) { t.actualMinutes = 0; migrated = true; }
                    if (t.estimatedMinutes === undefined) { t.estimatedMinutes = 0; migrated = true; }
                    if (t.createdAt === undefined) { t.createdAt = Date.now(); migrated = true; }
                }
            });
        });
    });

    if (migrated) saveDb(data);
    return data;
  },

  async getAllUsers(): Promise<User[]> {
      await delay(FAKE_LATENCY);
      const users = getUsersFromDb();
      return Array.isArray(users) ? users : [];
  },

  async toggleTask(campusId: CampusId, category: TaskCategory, taskId: string): Promise<AllCampusData> {
    const db = getDb();
    const campus = db[campusId];
    if (!campus) return db;
    const task = campus.tasks[category].find(t => t.id === taskId);
    if (!task) return db;

    const isCompleting = !task.completed;
    if (isCompleting) {
        if (task.status === TaskStatus.InProgress && task.sessions.length > 0) {
            const lastSession = task.sessions[task.sessions.length - 1];
            if (!lastSession.end) {
                lastSession.end = Date.now();
                task.actualMinutes += Math.round((lastSession.end - lastSession.start) / 60000);
            }
        }
        task.status = TaskStatus.Completed;
        task.completedAt = Date.now();
    } else {
        task.status = TaskStatus.Assigned;
        task.completedAt = undefined;
    }
    task.completed = isCompleting;
    saveDb(db);
    return db;
  },

  async startTask(campusId: CampusId, category: TaskCategory, taskId: string): Promise<AllCampusData> {
      const db = getDb();
      if (!db[campusId]) return db;
      
      Object.keys(db[campusId].tasks).forEach(cat => {
          db[campusId].tasks[cat as TaskCategory].forEach(t => {
              if (t.status === TaskStatus.InProgress && t.id !== taskId) {
                  const last = t.sessions[t.sessions.length - 1];
                  if (last && !last.end) {
                      last.end = Date.now();
                      t.actualMinutes += Math.round((last.end - last.start) / 60000);
                  }
                  t.status = TaskStatus.Paused;
              }
          });
      });

      const task = db[campusId].tasks[category].find(t => t.id === taskId);
      if (task) {
          task.status = TaskStatus.InProgress;
          task.sessions.push({ start: Date.now() });
          task.startedAt = task.startedAt || Date.now();
      }
      saveDb(db);
      return db;
  },

  async pauseTask(campusId: CampusId, category: TaskCategory, taskId: string): Promise<AllCampusData> {
      const db = getDb();
      if (!db[campusId]) return db;
      const task = db[campusId].tasks[category].find(t => t.id === taskId);
      if (task && task.status === TaskStatus.InProgress) {
          const last = task.sessions[task.sessions.length - 1];
          if (last && !last.end) {
              last.end = Date.now();
              task.actualMinutes += Math.round((last.end - last.start) / 60000);
          }
          task.status = TaskStatus.Paused;
      }
      saveDb(db);
      return db;
  },

  async addTask(campusId: CampusId, category: TaskCategory, description: string, estMinutes: number = 0, priority: Priority = Priority.Medium): Promise<AllCampusData> {
    const db = getDb();
    if (!db[campusId]) return db;
    const newTask: Task = {
        id: `${campusId.substring(0,2).toUpperCase()}-${category.substring(0,1).toUpperCase()}-${Date.now().toString().slice(-4)}`,
        description,
        isFixed: false,
        completed: false,
        status: TaskStatus.Assigned,
        priority,
        estimatedMinutes: estMinutes,
        actualMinutes: 0,
        createdAt: Date.now(),
        sessions: []
    };
    db[campusId].tasks[category].push(newTask);
    saveDb(db);
    return db;
  },

  async logAttendance(campusId: CampusId, type: 'in' | 'out'): Promise<AllCampusData> {
      const db = getDb();
      const campus = db[campusId];
      if (!campus) return db;
      
      const todayStr = new Date().toLocaleDateString('en-CA'); 
      
      if (!campus.attendance) campus.attendance = [];
      
      let record = campus.attendance.find(r => r.date === todayStr);
      if (!record) {
        record = { date: todayStr };
        campus.attendance.push(record);
      }

      if (type === 'in' && !record.checkIn) {
          record.checkIn = Date.now();
      } else if (type === 'out' && record.checkIn && !record.checkOut) {
          record.checkOut = Date.now();
          record.totalWorkMinutes = Math.round((record.checkOut - record.checkIn) / 60000);
      }
      
      saveDb(db);
      return db;
  },

  async deleteTask(campusId: CampusId, category: TaskCategory, taskId: string): Promise<AllCampusData> {
      const db = getDb();
      if (db[campusId]) {
        db[campusId].tasks[category] = db[campusId].tasks[category].filter(t => t.id !== taskId);
      }
      saveDb(db);
      return db;
  },

  async toggleTaskFix(campusId: CampusId, category: TaskCategory, taskId: string): Promise<AllCampusData> {
      const db = getDb();
      if (db[campusId]) {
        const task = db[campusId].tasks[category].find(t => t.id === taskId);
        if (task) task.isFixed = !task.isFixed;
      }
      saveDb(db);
      return db;
  },

  async markAllTodayComplete(campusId: CampusId): Promise<AllCampusData> {
      const db = getDb();
      if (db[campusId]) {
        db[campusId].tasks.today = db[campusId].tasks.today.map(t => ({
            ...t, 
            completed: true, 
            status: TaskStatus.Completed,
            completedAt: Date.now()
        }));
      }
      saveDb(db);
      return db;
  },
  
  async toggleBill(campusId: CampusId, billIndex: number): Promise<AllCampusData> {
    const db = getDb();
    if (db[campusId] && db[campusId].bills[billIndex]) {
      db[campusId].bills[billIndex].paid = !db[campusId].bills[billIndex].paid;
    }
    saveDb(db);
    return db;
  },

  async attachBill(campusId: CampusId, billIndex: number, fileUrl: string): Promise<AllCampusData> {
      const db = getDb();
      if (db[campusId] && db[campusId].bills[billIndex]) {
        db[campusId].bills[billIndex].attachment = fileUrl;
      }
      saveDb(db);
      return db;
  },

  async deleteAttachment(campusId: CampusId, billIndex: number): Promise<AllCampusData> {
      const db = getDb();
      if (db[campusId] && db[campusId].bills[billIndex]) {
        delete db[campusId].bills[billIndex].attachment;
      }
      saveDb(db);
      return db;
  },

  async addBill(campusId: CampusId, billData: Omit<Bill, 'paid' | 'attachment'>): Promise<AllCampusData> {
    const db = getDb();
    if (db[campusId]) {
      db[campusId].bills.push({ ...billData, paid: false });
    }
    saveDb(db);
    return db;
  },

  async resetCampus(campusId: CampusId): Promise<AllCampusData> {
      const db = getDb();
      db[campusId] = JSON.parse(JSON.stringify(INITIAL_DATA[campusId]));
      saveDb(db);
      return db;
  },

  async resetAll(): Promise<AllCampusData> {
      cloudStore.reset();
      syncChannel.postMessage({ type: 'DATA_UPDATED' });
      return cloudStore.getData();
  },

  async backupData(): Promise<void> {
    const data = getDb();
    const users = getUsersFromDb();
    const blob = new Blob([JSON.stringify({ data, users }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiqh-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  },

  async restoreData(jsonContent: string): Promise<void> {
    try {
      const backup = JSON.parse(jsonContent);
      if (backup.data && backup.users) {
          cloudStore.setData(backup.data);
          cloudStore.setUsers(backup.users);
          syncChannel.postMessage({ type: 'DATA_UPDATED' });
      }
    } catch (e) {
      console.error("Failed to restore data:", e);
      alert("Invalid backup file format.");
    }
  },

  async addUser(newUser: Omit<User, 'id'>): Promise<User[]> {
      const users = getUsersFromDb();
      users.push({ ...newUser, id: Date.now() });
      saveUsersToDb(users);
      return users;
  },

  async updateUser(updatedUser: User): Promise<User[]> {
      const users = getUsersFromDb();
      const index = users.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) { users[index] = updatedUser; saveUsersToDb(users); }
      return users;
  },
  
  async deleteUser(userId: number): Promise<User[]> {
      let users = getUsersFromDb().filter(u => u.id !== userId);
      saveUsersToDb(users);
      return users;
  }
};
