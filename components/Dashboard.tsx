import React, { useState, useEffect } from 'react';
import { User, Theme, CampusId, AllCampusData, TaskCategory, UserRole } from '../types';
import { databaseService } from '../services/database';
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
    // No loading spinner on subsequent fetches to provide a smoother sync experience
    if (isLoading) setIsLoading(true);
    const data = await databaseService.getAllData();
    setAllData(data);
    if (isLoading) setIsLoading(false);
  };

  useEffect(() => {
    fetchData();

    const syncChannel = new BroadcastChannel('dashboard-sync');
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'DATA_UPDATED') {
        databaseService.getAllData().then(setAllData);
      }
    };

    syncChannel.addEventListener('message', handleMessage);

    return () => {
      syncChannel.removeEventListener('message', handleMessage);
      syncChannel.close();
    };
  }, []);
  
  const handleSelectCampus = (campusId: CampusId) => {
    setActiveCampus(campusId);
  };
  
  const onToggleTask = async (campusId: CampusId, category: TaskCategory, taskId: string) => {
    const updatedData = await databaseService.toggleTask(campusId, category, taskId);
    setAllData(updatedData);
  };

  const onAddTask = async (campusId: CampusId, category: TaskCategory, description: string) => {
    if (!description.trim()) return;
    const updatedData = await databaseService.addTask(campusId, category, description);
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

  const onToggleBill = async (campusId: CampusId, billIndex: number) => {
    const updatedData = await databaseService.toggleBill(campusId, billIndex);
    setAllData(updatedData);
  };

  const onAttachBill = (campusId: CampusId, billIndex: number, file: File) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
          const fileUrl = event.target?.result as string;
          const updatedData = await databaseService.attachBill(campusId, billIndex, fileUrl);
          setAllData(updatedData);
      };
      reader.readAsDataURL(file);
  };

  const onDeleteAttachment = async (campusId: CampusId, billIndex: number) => {
    const updatedData = await databaseService.deleteAttachment(campusId, billIndex);
    setAllData(updatedData);
  };

  const onResetAll = async () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      const updatedData = await databaseService.resetAll();
      const updatedUsers = await databaseService.getAllUsers();
      setAllData(updatedData);
      setUsers(updatedUsers);
    }
  };

  const onResetCampus = async (campusId: CampusId) => {
    if (window.confirm(`Are you sure you want to reset data for ${campusId} campus?`)) {
      const updatedData = await databaseService.resetCampus(campusId);
      setAllData(updatedData);
    }
  };

  const onMarkAllTodayComplete = async (campusId: CampusId) => {
    const updatedData = await databaseService.markAllTodayComplete(campusId);
    setAllData(updatedData);
  };

  const onAddUser = async (user: Omit<User, 'id'>) => {
      const updatedUsers = await databaseService.addUser(user);
      setUsers(updatedUsers);
  };

  const onUpdateUser = async (updatedUser: User) => {
      const updatedUsers = await databaseService.updateUser(updatedUser);
      setUsers(updatedUsers);
  };
  
  const onDeleteUser = async (userId: number) => {
      if (user.id === userId) {
          alert("You cannot delete your own account.");
          return;
      }
      if (window.confirm("Are you sure you want to delete this user?")) {
        const updatedUsers = await databaseService.deleteUser(userId);
        setUsers(updatedUsers);
      }
  };
  
  const handleBackup = async () => {
    await databaseService.backupData();
  };

  const handleRestore = async (file: File) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
          try {
              const jsonContent = event.target?.result as string;
              await databaseService.restoreData(jsonContent);
              // Refetch all data to update the UI
              fetchData();
              databaseService.getAllUsers().then(setUsers);
              alert("Data restored successfully!");
              setIsSettingsOpen(false);
          } catch (error) {
              console.error("Restore failed:", error);
              alert("Failed to restore data. The backup file may be invalid.");
          }
      };
      reader.readAsText(file);
  };


  const campusesForUser = user.role === UserRole.Admin 
      ? Object.values(CampusId) 
      : [user.campusId];
      
  if (user.role === UserRole.Admin && !campusesForUser.includes(CampusId.ControlPanel)) {
    campusesForUser.push(CampusId.ControlPanel);
  }

  const campusData = allData ? allData[activeCampus] : null;

  if (isLoading || !allData) {
      return (
          <div className="flex items-center justify-center min-h-screen" style={{ color: 'var(--text-color)' }}>
              <div className="flex flex-col items-center">
                  <i className="fas fa-spinner fa-spin fa-3x"></i>
                  <p className="mt-4 text-lg">Loading Dashboard...</p>
              </div>
          </div>
      );
  }

  return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
          <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
          <div className="max-w-7xl mx-auto rounded-xl shadow-2xl" style={{ backgroundColor: 'var(--card-bg)' }}>
              <IslamicHeader />
              <div className="p-4">
                  <DashboardHeader 
                      user={user} 
                      onLogout={onLogout} 
                      onSearch={setSearchTerm} 
                      onOpenSettings={() => setIsSettingsOpen(true)}
                      isCloudSyncOn={isCloudSyncOn}
                  />
                  <StatsOverview allData={allData} />

                  {user.role === UserRole.Admin && (
                    <div className="my-4 border-t-2 pt-4" style={{ borderColor: 'var(--cream-dark)' }}>
                        <AllCampusesOverview allData={allData} onSelectCampus={handleSelectCampus} />
                    </div>
                  )}

                  {searchTerm ? (
                      <SearchResults allData={allData} searchTerm={searchTerm} />
                  ) : (
                      <>
                          <CampusTabs campuses={campusesForUser} activeCampus={activeCampus} onSelectCampus={handleSelectCampus} />
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
                              />
                          )}
                      </>
                  )}
              </div>
          </div>
          {isSettingsOpen && (
              <SettingsModal
                  onClose={() => setIsSettingsOpen(false)}
                  onBackup={handleBackup}
                  onRestore={handleRestore}
                  currentTheme={currentTheme}
                  lastLightTheme={lastLightTheme}
                  onThemeChange={onThemeChange}
                  isCloudSyncOn={isCloudSyncOn}
                  onToggleCloudSync={() => setIsCloudSyncOn(prev => !prev)}
              />
          )}
      </div>
  );
};

export default Dashboard;