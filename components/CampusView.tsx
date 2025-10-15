import React from 'react';
import { CampusData, CampusId, TaskCategory, UserRole } from '../types';
import TaskCard from './TaskCard';
import BillsCard from './BillsCard';
import QuickActionsCard from './QuickActionsCard';

interface CampusViewProps {
  campusId: CampusId;
  campusData: CampusData;
  userRole: UserRole;
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
}

const CampusView: React.FC<CampusViewProps> = (props) => {
  const { campusId, campusData, userRole, ...actions } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TaskCard title="Today's Tasks" campusId={campusId} category={TaskCategory.Today} tasks={campusData.tasks.today} userRole={userRole} {...actions} />
        <TaskCard title="Daily Tasks" campusId={campusId} category={TaskCategory.Daily} tasks={campusData.tasks.daily} userRole={userRole} {...actions} />
        <TaskCard title="Weekly Tasks" campusId={campusId} category={TaskCategory.Weekly} tasks={campusData.tasks.weekly} userRole={userRole} {...actions} />
        <TaskCard title="Monthly Tasks" campusId={campusId} category={TaskCategory.Monthly} tasks={campusData.tasks.monthly} userRole={userRole} {...actions} />
      </div>
      <div className="space-y-4">
        <BillsCard 
            campusId={campusId} 
            bills={campusData.bills} 
            onToggleBill={actions.onToggleBill} 
            onAttachBill={props.onAttachBill}
            onDeleteAttachment={props.onDeleteAttachment}
        />
        <QuickActionsCard campusId={campusId} userRole={userRole} onMarkAllTodayComplete={actions.onMarkAllTodayComplete} onResetCampus={actions.onResetCampus} onResetAll={actions.onResetAll} />
      </div>
    </div>
  );
};

export default CampusView;