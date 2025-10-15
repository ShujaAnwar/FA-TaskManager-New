import React from 'react';
import { CampusData, CampusId, TaskCategory, UserRole, AllCampusData, Bill } from '../types';
import TaskCard from './TaskCard';
import BillsCard from './BillsCard';
import QuickActionsCard from './QuickActionsCard';

interface CampusViewProps {
  campusId: CampusId;
  campusData: CampusData;
  userRole: UserRole;
  allCampusData?: AllCampusData;
  onAddTask: (campusId: CampusId, category: TaskCategory, description: string) => void;
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
}

const CampusView: React.FC<CampusViewProps> = (props) => {
  const { campusId, campusData, userRole, allCampusData, onAddTask, onToggleTask, onDeleteTask, onToggleTaskFix, onToggleBill, onAttachBill, onDeleteAttachment, onAddBill, ...quickActions } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TaskCard title="Today's Tasks" campusId={campusId} category={TaskCategory.Today} tasks={campusData.tasks.today} userRole={userRole} onAddTask={onAddTask} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} onToggleTaskFix={onToggleTaskFix} />
        <TaskCard title="Daily Tasks" campusId={campusId} category={TaskCategory.Daily} tasks={campusData.tasks.daily} userRole={userRole} onAddTask={onAddTask} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} onToggleTaskFix={onToggleTaskFix} />
        <TaskCard title="Weekly Tasks" campusId={campusId} category={TaskCategory.Weekly} tasks={campusData.tasks.weekly} userRole={userRole} onAddTask={onAddTask} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} onToggleTaskFix={onToggleTaskFix} />
        <TaskCard title="Monthly Tasks" campusId={campusId} category={TaskCategory.Monthly} tasks={campusData.tasks.monthly} userRole={userRole} onAddTask={onAddTask} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} onToggleTaskFix={onToggleTaskFix} />
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
        <QuickActionsCard campusId={campusId} userRole={userRole} onMarkAllTodayComplete={quickActions.onMarkAllTodayComplete} onResetCampus={quickActions.onResetCampus} onResetAll={quickActions.onResetAll} />
      </div>
    </div>
  );
};

export default CampusView;