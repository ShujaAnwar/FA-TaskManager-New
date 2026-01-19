
import React, { useState } from 'react';
import { Task, CampusId, TaskCategory, UserRole } from '../types';
import TaskItem from './TaskItem';

interface TaskCardProps {
    title: string;
    tasks: Task[];
    campusId: CampusId;
    category: TaskCategory;
    userRole: UserRole;
    onAddTask: (campusId: CampusId, category: TaskCategory, description: string, estMinutes: number) => void;
    onToggleTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
    onToggleTaskFix: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
    onDeleteTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
    onStartTask?: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
    onPauseTask?: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
}

const DURATION_OPTIONS = [
    { label: '5 mins', value: 5 },
    { label: '10 mins', value: 10 },
    { label: '15 mins', value: 15 },
    { label: '30 mins', value: 30 },
    { label: '45 mins', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '1.5 hours', value: 90 },
    { label: '2 hours', value: 120 },
    { label: '3 hours', value: 180 },
    { label: '4 hours', value: 240 },
    { label: '5 hours', value: 300 },
    { label: '6 hours', value: 360 },
    { label: '8 hours', value: 480 },
    { label: '12 hours', value: 720 },
    { label: '24 hours', value: 1440 },
];

const TaskCard: React.FC<TaskCardProps> = ({ title, tasks, campusId, category, userRole, onAddTask, onToggleTask, onDeleteTask, onToggleTaskFix, onStartTask, onPauseTask }) => {
    const [newTask, setNewTask] = useState('');
    const [estMinutes, setEstMinutes] = useState('0');

    const handleAddTask = () => {
        if (!newTask.trim()) return;
        onAddTask(campusId, category, newTask, parseInt(estMinutes) || 0);
        setNewTask('');
        setEstMinutes('0');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAddTask();
    };

    return (
        <div className="flex flex-col rounded-xl shadow-lg transition-transform hover:transform hover:-translate-y-1" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="flex justify-between items-center p-2 border-b-2" style={{ borderColor: 'var(--cream-dark)', color: 'var(--text-color)' }}>
                <h3 className="font-semibold text-sm">{title}</h3>
                <span className="text-xs font-bold text-white rounded-full h-5 w-5 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)'}}>
                    {tasks.length}
                </span>
            </div>
            <div className="p-2 space-y-2" style={{ backgroundColor: 'var(--cream-light)'}}>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add new task..."
                        className="flex-grow p-1.5 text-xs border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center text-[10px] font-bold text-gray-500 uppercase">Est:</div>
                    <select 
                        value={estMinutes} 
                        onChange={e => setEstMinutes(e.target.value)} 
                        className="flex-grow p-1 text-[11px] border rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                    >
                        <option value="0">Duration</option>
                        {DURATION_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <button 
                        onClick={handleAddTask} 
                        className="flex-grow text-white py-1 px-3 text-xs font-semibold rounded shadow-sm hover:opacity-90 active:scale-95 transition-all" 
                        style={{ backgroundColor: 'var(--primary)' }}
                    >
                        Assign
                    </button>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto max-h-[300px]">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            userRole={userRole}
                            onToggle={() => onToggleTask(campusId, category, task.id)}
                            onDelete={() => onDeleteTask(campusId, category, task.id)}
                            onToggleFix={() => onToggleTaskFix(campusId, category, task.id)}
                            onStart={() => onStartTask?.(campusId, category, task.id)}
                            onPause={() => onPauseTask?.(campusId, category, task.id)}
                        />
                    ))
                ) : (
                    <p className="p-4 text-xs text-center text-gray-500">No tasks here.</p>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
