
import React, { useState, useMemo } from 'react';
import { Task, CampusId, TaskCategory, UserRole, Priority, TaskStatus } from '../types';
import TaskItem from './TaskItem';

interface TaskCardProps {
    title: string;
    tasks: Task[];
    campusId: CampusId;
    category: TaskCategory;
    userRole: UserRole;
    onAddTask: (campusId: CampusId, category: TaskCategory, description: string, estMinutes: number, priority: Priority) => void;
    onUpdateTask: (campusId: CampusId, category: TaskCategory, taskId: string, updates: Partial<Task>) => void;
    onToggleTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
    onToggleTaskFix: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
    onDeleteTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
    onStartTask?: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
    onPauseTask?: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
    hideCompleted?: boolean;
}

const DURATION_OPTIONS = [
    { label: '5 mins', value: 5 },
    { label: '10 mins', value: 10 },
    { label: '15 mins', value: 15 },
    { label: '30 mins', value: 30 },
    { label: '45 mins', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
];

const PRIORITY_OPTIONS = [
    { label: 'Low', value: Priority.Low, color: 'text-gray-500' },
    { label: 'Medium', value: Priority.Medium, color: 'text-blue-500' },
    { label: 'High', value: Priority.High, color: 'text-orange-500' },
    { label: 'Urgent', value: Priority.Urgent, color: 'text-red-600' },
];

const TaskCard: React.FC<TaskCardProps> = ({ title, tasks, campusId, category, userRole, onAddTask, onUpdateTask, onToggleTask, onDeleteTask, onToggleTaskFix, onStartTask, onPauseTask, hideCompleted = false }) => {
    const [newTask, setNewTask] = useState('');
    const [estMinutes, setEstMinutes] = useState('0');
    const [priority, setPriority] = useState<Priority>(Priority.Medium);

    const handleAddTask = () => {
        if (!newTask.trim()) return;
        onAddTask(campusId, category, newTask, parseInt(estMinutes) || 0, priority);
        setNewTask('');
        setEstMinutes('0');
        setPriority(Priority.Medium);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAddTask();
    };

    const processedTasks = useMemo(() => {
        let filtered = [...tasks];
        if (hideCompleted) {
            filtered = filtered.filter(t => t.status !== TaskStatus.Completed);
        }
        const priorityOrder = { [Priority.Urgent]: 0, [Priority.High]: 1, [Priority.Medium]: 2, [Priority.Low]: 3 };
        return filtered.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
        });
    }, [tasks, hideCompleted]);

    return (
        <div className="flex flex-col rounded-xl shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="flex justify-between items-center p-2 border-b-2" style={{ borderColor: 'var(--cream-dark)', color: 'var(--text-color)' }}>
                <h3 className="font-semibold text-sm">{title}</h3>
                <span className="text-xs font-bold text-white rounded-full h-5 w-5 flex items-center justify-center bg-blue-600">
                    {processedTasks.length}
                </span>
            </div>
            <div className="p-2 space-y-2 border-b bg-gray-50/30">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe today's objective..."
                    className="w-full p-2 text-xs border rounded outline-none"
                />
                <div className="flex items-center gap-2">
                    <select value={priority} onChange={e => setPriority(e.target.value as Priority)} className="w-1/3 p-1.5 text-[10px] border rounded font-bold">
                        {PRIORITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <select value={estMinutes} onChange={e => setEstMinutes(e.target.value)} className="w-1/3 p-1.5 text-[10px] border rounded">
                        <option value="0">Est Time</option>
                        {DURATION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <button onClick={handleAddTask} className="w-1/3 text-white py-1.5 px-3 text-xs font-bold rounded bg-blue-600 hover:bg-blue-700">Assign</button>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto max-h-[400px]">
                {processedTasks.length > 0 ? (
                    processedTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            userRole={userRole}
                            onToggle={() => onToggleTask(campusId, category, task.id)}
                            onDelete={() => onDeleteTask(campusId, category, task.id)}
                            onToggleFix={() => onToggleTaskFix(campusId, category, task.id)}
                            onStart={() => onStartTask?.(campusId, category, task.id)}
                            onPause={() => onPauseTask?.(campusId, category, task.id)}
                            onUpdate={(updates) => onUpdateTask(campusId, category, task.id, updates)}
                        />
                    ))
                ) : (
                    <p className="p-4 text-xs text-center text-gray-500 italic">No tasks assigned for this category.</p>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
