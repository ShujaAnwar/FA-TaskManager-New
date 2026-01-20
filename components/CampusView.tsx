
import React, { useState } from 'react';
import { CampusData, CampusId, TaskCategory, UserRole, AllCampusData, Bill, TaskStatus, Task, Priority } from '../types';
import TaskCard from './TaskCard';
import BillsCard from './BillsCard';
import QuickActionsCard from './QuickActionsCard';
import ActiveTaskPanel from './ActiveTaskPanel';
import ReminderLibrary from './ReminderLibrary';

interface CampusViewProps {
  campusId: CampusId;
  campusData: CampusData;
  userRole: UserRole;
  allCampusData?: AllCampusData;
  onAddTask: (campusId: CampusId, category: TaskCategory, description: string, estMinutes: number, priority: Priority) => void;
  onUpdateTask: (campusId: CampusId, category: TaskCategory, taskId: string, updates: Partial<Task>) => void;
  onToggleTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
  onDeleteTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
  onToggleTaskFix: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
  onToggleBill: (campusId: CampusId, billIndex: number) => void;
  onUpdateBill: (campusId: CampusId, billIndex: number, updates: Partial<Bill>) => void;
  onResetAll: () => void;
  onResetCampus: (campusId: CampusId) => void;
  onMarkAllTodayComplete: (campusId: CampusId) => void;
  onAttachBill: (campusId: CampusId, billIndex: number, file: File) => void;
  onDeleteAttachment: (campusId: CampusId, billIndex: number) => void;
  onAddBill: (campusId: CampusId, billData: Omit<Bill, 'paid' | 'attachment'>) => void;
  onStartTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
  onPauseTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
  onGenerateReport: (type: 'Daily' | 'Monthly', fromDate?: string, tillDate?: string) => void;
  onLogAttendance: (campusId: CampusId, type: 'in' | 'out') => void;
}

const CampusView: React.FC<CampusViewProps> = (props) => {
  const { 
      campusId, campusData, userRole, allCampusData, 
      onAddTask, onUpdateTask, onToggleTask, onDeleteTask, onToggleTaskFix, 
      onToggleBill, onUpdateBill, onAttachBill, onDeleteAttachment, onAddBill,
      onStartTask, onPauseTask, onGenerateReport, onLogAttendance,
      ...quickActions 
  } = props;

  const activeTasks = Object.keys(campusData.tasks).flatMap(cat => 
      campusData.tasks[cat as TaskCategory]
        .filter(t => t.status === TaskStatus.InProgress)
        .map(t => ({ task: t, category: cat as TaskCategory }))
  );

  const handleAddFromReminder = (reminder: Task) => {
      onAddTask(campusId, TaskCategory.Today, reminder.description, reminder.estimatedMinutes, reminder.priority);
  };

  return (
    <div className="flex flex-col gap-4">
      {activeTasks.length > 0 && (
          <div className="space-y-4">
            {activeTasks.map(({ task, category }) => (
                <ActiveTaskPanel 
                    key={task.id}
                    activeTask={task} 
                    campusId={campusId} 
                    category={category} 
                    onPause={onPauseTask} 
                    onComplete={onToggleTask} 
                />
            ))}
          </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <i className="fas fa-calendar-day"></i>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Active Objectives (Today)</h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Primary Operation Scope</p>
                </div>
             </div>
             <TaskCard 
                title="Immediate Tasks" 
                campusId={campusId} 
                category={TaskCategory.Today} 
                tasks={campusData.tasks.today} 
                userRole={userRole} 
                onAddTask={onAddTask} 
                onUpdateTask={onUpdateTask}
                onToggleTask={onToggleTask} 
                onDeleteTask={onDeleteTask} 
                onToggleTaskFix={onToggleTaskFix} 
                onStartTask={onStartTask} 
                onPauseTask={onPauseTask}
                hideCompleted={false} // Rule: Completed tasks must remain visible in task box
             />
          </div>

          <BillsCard 
              campusId={campusId} 
              bills={campusData.bills}
              allData={allCampusData} 
              onToggleBill={onToggleBill} 
              onUpdateBill={onUpdateBill}
              onAttachBill={onAttachBill}
              onDeleteAttachment={onDeleteAttachment}
              onAddBill={onAddBill}
          />
        </div>

        <div className="space-y-6">
          <ReminderLibrary 
              campusId={campusId}
              tasks={campusData.tasks} 
              onAddToToday={handleAddFromReminder} 
              onAddTask={onAddTask}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
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
