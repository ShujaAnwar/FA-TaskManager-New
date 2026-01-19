
import React from 'react';
import { CampusData, CampusId, TaskCategory, UserRole, AllCampusData, Bill, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import BillsCard from './BillsCard';
import QuickActionsCard from './QuickActionsCard';
import ActiveTaskPanel from './ActiveTaskPanel';

interface CampusViewProps {
  campusId: CampusId;
  campusData: CampusData;
  userRole: UserRole;
  allCampusData?: AllCampusData;
  onAddTask: (campusId: CampusId, category: TaskCategory, description: string, estMinutes: number) => void;
  onToggleTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
  onDeleteTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
  onToggleTaskFix: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
  onToggleBill: (campusId: CampusId, billIndex: number) => void;
  onResetAll: () => void;
  onResetCampus: (campusId: CampusId) => void;
  onMarkAllTodayComplete: (campusId: CampusId) => void;
  onAttachBill: (campusId: CampusId, billIndex: number, file: File) => void;
  onDeleteAttachment: (campusId: CampusId, billIndex: number) => void;
  onAddBill: (campusId: CampusId, billData: Omit<Bill, 'paid' | 'attachment'>) => void;
  onStartTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
  onPauseTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
  onGenerateReport: (type: 'Daily' | 'Monthly') => void;
  onLogAttendance: (campusId: CampusId, type: 'in' | 'out') => void;
}

const CampusView: React.FC<CampusViewProps> = (props) => {
  const { 
      campusId, campusData, userRole, allCampusData, 
      onAddTask, onToggleTask, onDeleteTask, onToggleTaskFix, 
      onToggleBill, onAttachBill, onDeleteAttachment, onAddBill,
      onStartTask, onPauseTask, onGenerateReport, onLogAttendance,
      ...quickActions 
  } = props;

  // Find the currently active task if any
  const findActiveTask = () => {
      for (const cat of Object.keys(campusData.tasks)) {
          const active = campusData.tasks[cat as TaskCategory].find(t => t.status === TaskStatus.InProgress);
          if (active) return { task: active, category: cat as TaskCategory };
      }
      return null;
  };

  const activeInfo = findActiveTask();

  return (
    <div className="flex flex-col gap-4">
      {activeInfo && (
          <ActiveTaskPanel 
            activeTask={activeInfo.task} 
            campusId={campusId} 
            category={activeInfo.category} 
            onPause={onPauseTask} 
            onComplete={onToggleTask} 
          />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <TaskCard title="Today's Tasks" campusId={campusId} category={TaskCategory.Today} tasks={campusData.tasks.today} userRole={userRole} onAddTask={onAddTask} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} onToggleTaskFix={onToggleTaskFix} onStartTask={onStartTask} onPauseTask={onPauseTask} />
          <TaskCard title="Daily Tasks" campusId={campusId} category={TaskCategory.Daily} tasks={campusData.tasks.daily} userRole={userRole} onAddTask={onAddTask} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} onToggleTaskFix={onToggleTaskFix} onStartTask={onStartTask} onPauseTask={onPauseTask} />
          <TaskCard title="Weekly Tasks" campusId={campusId} category={TaskCategory.Weekly} tasks={campusData.tasks.weekly} userRole={userRole} onAddTask={onAddTask} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} onToggleTaskFix={onToggleTaskFix} onStartTask={onStartTask} onPauseTask={onPauseTask} />
          <TaskCard title="Monthly Tasks" campusId={campusId} category={TaskCategory.Monthly} tasks={campusData.tasks.monthly} userRole={userRole} onAddTask={onAddTask} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} onToggleTaskFix={onToggleTaskFix} onStartTask={onStartTask} onPauseTask={onPauseTask} />
        </div>
        <div className="space-y-4">
          <BillsCard 
              campusId={campusId} 
              bills={campusData.bills}
              allData={allCampusData} 
              onToggleBill={onToggleBill} 
              onAttachBill={onAttachBill}
              onDeleteAttachment={onDeleteAttachment}
              onAddBill={onAddBill}
          />
          <QuickActionsCard 
              campusId={campusId} 
              userRole={userRole} 
              onMarkAllTodayComplete={quickActions.onMarkAllTodayComplete} 
              onResetCampus={quickActions.onResetCampus} 
              onResetAll={quickActions.onResetAll} 
              onGenerateReport={onGenerateReport}
              onLogAttendance={onLogAttendance}
              attendance={campusData.attendance}
          />
        </div>
      </div>
    </div>
  );
};

export default CampusView;
