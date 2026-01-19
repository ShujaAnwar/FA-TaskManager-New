
import React, { useState, useEffect } from 'react';
import { User, Theme, CampusId, AllCampusData, TaskCategory, UserRole, Bill, Task } from '../types';
import { databaseService } from '../services/database';
import { reportingService } from '../services/reporting';
import DashboardHeader from './DashboardHeader';
import IslamicHeader from './IslamicHeader';
import StatsOverview from './StatsOverview';
import CampusTabs from './CampusTabs';
import CampusView from './CampusView';
import ControlPanel from './ControlPanel';
import ThemeSelector from './ThemeSelector';
import SearchResults from './SearchResults';
import AllCampusesOverview from './AllCampusesOverview';
import SettingsModal from './SettingsModal';
import { INITIAL_DATA } from '../constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  currentTheme: Theme;
  lastLightTheme: Theme;
  onThemeChange: (themeName: string) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, currentTheme, lastLightTheme, onThemeChange, users, setUsers }) => {
  const [allData, setAllData] = useState<AllCampusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCloudSyncOn, setIsCloudSyncOn] = useState(true);

  const getInitialCampus = (user: User): CampusId => {
    return user.role === UserRole.Admin ? CampusId.Main : user.campusId;
  };
  
  const [activeCampus, setActiveCampus] = useState<CampusId>(getInitialCampus(user));
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
        setIsLoading(true);
        const data = await databaseService.getAllData();
        setAllData(data);
    } catch (error) {
        console.error("Critical error fetching dashboard data:", error);
        // Fallback to initial constants to allow the UI to render
        setAllData(JSON.parse(JSON.stringify(INITIAL_DATA)));
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const syncChannel = new BroadcastChannel('dashboard-sync');
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'DATA_UPDATED') {
        databaseService.getAllData().then(setAllData).catch(err => {
            console.error("Sync error:", err);
        });
      }
    };
    syncChannel.addEventListener('message', handleMessage);
    return () => {
      syncChannel.removeEventListener('message', handleMessage);
      syncChannel.close();
    };
  }, []);
  
  const onToggleTask = async (campusId: CampusId, category: TaskCategory, taskId: string) => {
    const updatedData = await databaseService.toggleTask(campusId, category, taskId);
    setAllData(updatedData);
  };

  const onAddTask = async (campusId: CampusId, category: TaskCategory, description: string, estMinutes: number = 0) => {
    const updatedData = await databaseService.addTask(campusId, category, description, estMinutes);
    setAllData(updatedData);
  };
  
  const onDeleteTask = async (campusId: CampusId, category: TaskCategory, taskId: string) => {
    const updatedData = await databaseService.deleteTask(campusId, category, taskId);
    setAllData(updatedData);
  };

  const onToggleTaskFix = async (campusId: CampusId, category: TaskCategory, taskId: string) => {
    const updatedData = await databaseService.toggleTaskFix(campusId, category, taskId);
    setAllData(updatedData);
  };

  const onStartTask = async (campusId: CampusId, category: TaskCategory, taskId: string) => {
    const updatedData = await databaseService.startTask(campusId, category, taskId);
    setAllData(updatedData);
  };

  const onPauseTask = async (campusId: CampusId, category: TaskCategory, taskId: string) => {
    const updatedData = await databaseService.pauseTask(campusId, category, taskId);
    setAllData(updatedData);
  };

  const onLogAttendance = async (campusId: CampusId, type: 'in' | 'out') => {
      const updatedData = await databaseService.logAttendance(campusId, type);
      setAllData(updatedData);
  };

  const onGenerateReport = (type: 'Daily' | 'Monthly') => {
      if (!allData || !activeCampus || activeCampus === CampusId.ControlPanel) return;
      const campusData = allData[activeCampus];
      if (!campusData) return;
      const tasks = Object.values(campusData.tasks).flat() as Task[];
      reportingService.generatePDF(user, activeCampus, tasks, type, campusData.attendance);
  };

  const onToggleBill = async (campusId: CampusId, billIndex: number) => {
    const updatedData = await databaseService.toggleBill(campusId, billIndex);
    setAllData(updatedData);
  };

  const onAttachBill = (campusId: CampusId, billIndex: number, file: File) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
          const updatedData = await databaseService.attachBill(campusId, billIndex, event.target?.result as string);
          setAllData(updatedData);
      };
      reader.readAsDataURL(file);
  };

  const onDeleteAttachment = async (campusId: CampusId, billIndex: number) => {
    const updatedData = await databaseService.deleteAttachment(campusId, billIndex);
    setAllData(updatedData);
  };

  const onAddBill = async (campusId: CampusId, billData: Omit<Bill, 'paid'|'attachment'>) => {
    const updatedData = await databaseService.addBill(campusId, billData);
    setAllData(updatedData);
  };

  const onResetAll = async () => {
    if (window.confirm("Reset all data?")) {
      const updatedData = await databaseService.resetAll();
      setAllData(updatedData);
    }
  };

  const onResetCampus = async (campusId: CampusId) => {
    if (window.confirm(`Reset ${campusId}?`)) {
      const updatedData = await databaseService.resetCampus(campusId);
      setAllData(updatedData);
    }
  };

  const onMarkAllTodayComplete = async (campusId: CampusId) => {
    const updatedData = await databaseService.markAllTodayComplete(campusId);
    setAllData(updatedData);
  };

  const onAddUser = async (u: Omit<User, 'id'>) => setUsers(await databaseService.addUser(u));
  const onUpdateUser = async (u: User) => setUsers(await databaseService.updateUser(u));
  const onDeleteUser = async (id: number) => setUsers(await databaseService.deleteUser(id));
  const handleBackup = async () => await databaseService.backupData();
  const handleRestore = async (file: File) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
          await databaseService.restoreData(e.target?.result as string);
          fetchData();
          databaseService.getAllUsers().then(setUsers);
      };
      reader.readAsText(file);
  };

  const campusesForUser = user.role === UserRole.Admin ? Object.values(CampusId) : [user.campusId];
  if (user.role === UserRole.Admin && !campusesForUser.includes(CampusId.ControlPanel)) campusesForUser.push(CampusId.ControlPanel);
  const campusData = allData ? allData[activeCampus] : null;

  if (isLoading || !allData) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
            <i className="fas fa-spinner fa-spin fa-3x mb-4"></i>
            <p className="animate-pulse">Initializing Command Center...</p>
        </div>
      );
  }

  return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
          <div className="max-w-7xl mx-auto rounded-xl shadow-2xl" style={{ backgroundColor: 'var(--card-bg)' }}>
              <IslamicHeader />
              <div className="p-4">
                  <DashboardHeader user={user} onLogout={onLogout} onSearch={setSearchTerm} onOpenSettings={() => setIsSettingsOpen(true)} isCloudSyncOn={isCloudSyncOn} />
                  <StatsOverview allData={allData} />

                  {user.role === UserRole.Admin && (
                    <div className="my-4 border-t-2 pt-4" style={{ borderColor: 'var(--cream-dark)' }}>
                        <AllCampusesOverview allData={allData} onSelectCampus={setActiveCampus} />
                    </div>
                  )}

                  {searchTerm ? <SearchResults allData={allData} searchTerm={searchTerm} /> : (
                      <>
                          <CampusTabs campuses={campusesForUser} activeCampus={activeCampus} onSelectCampus={setActiveCampus} />
                          {activeCampus === CampusId.ControlPanel ? (
                              <ControlPanel users={users} currentUser={user} onAddUser={onAddUser} onUpdateUser={onUpdateUser} onDeleteUser={onDeleteUser} />
                          ) : (
                              campusData && <CampusView
                                  campusId={activeCampus}
                                  campusData={campusData}
                                  userRole={user.role}
                                  onAddTask={onAddTask}
                                  onToggleTask={onToggleTask}
                                  onDeleteTask={onDeleteTask}
                                  onToggleTaskFix={onToggleTaskFix}
                                  onToggleBill={onToggleBill}
                                  onResetAll={onResetAll}
                                  onResetCampus={onResetCampus}
                                  onMarkAllTodayComplete={onMarkAllTodayComplete}
                                  onAttachBill={onAttachBill}
                                  onDeleteAttachment={onDeleteAttachment}
                                  onAddBill={onAddBill}
                                  onStartTask={onStartTask}
                                  onPauseTask={onPauseTask}
                                  onGenerateReport={onGenerateReport}
                                  onLogAttendance={onLogAttendance}
                              />
                          )}
                      </>
                  )}
              </div>
          </div>
          {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} onBackup={handleBackup} onRestore={handleRestore} currentTheme={currentTheme} lastLightTheme={lastLightTheme} onThemeChange={onThemeChange} isCloudSyncOn={isCloudSyncOn} onToggleCloudSync={() => setIsCloudSyncOn(!isCloudSyncOn)} />}
      </div>
  );
};

export default Dashboard;
