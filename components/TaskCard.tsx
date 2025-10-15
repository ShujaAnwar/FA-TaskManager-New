import React, { useState } from 'react';
import { Task, CampusId, TaskCategory, UserRole } from '../types';
import TaskItem from './TaskItem';

interface TaskCardProps {
    title: string;
    tasks: Task[];
    campusId: CampusId;
    category: TaskCategory;
    userRole: UserRole;
    onAddTask: (campusId: CampusId, category: TaskCategory, description: string) => void;
    onToggleTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
    onToggleTaskFix: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
    onDeleteTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, tasks, campusId, category, userRole, onAddTask, onToggleTask, onDeleteTask, onToggleTaskFix }) => {
    const [newTask, setNewTask] = useState('');

    const handleAddTask = () => {
        onAddTask(campusId, category, newTask);
        setNewTask('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };
    
    // Do not render the card if there are no fixed tasks and no user-added tasks
    if (tasks.length === 0 && category !== TaskCategory.Today) {
        const hasFixedTasks = tasks.some(t => t.isFixed);
        if (!hasFixedTasks) return null;
    }


    return (
        <div className="flex flex-col rounded-xl shadow-lg transition-transform hover:transform hover:-translate-y-1" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="flex justify-between items-center p-2 border-b-2" style={{ borderColor: 'var(--cream-dark)', color: 'var(--text-color)' }}>
                <h3 className="font-semibold text-sm">{title}</h3>
                <span className="text-xs font-bold text-white rounded-full h-5 w-5 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)'}}>
                    {tasks.length}
                </span>
            </div>
            <div className="p-2" style={{ backgroundColor: 'var(--cream-light)'}}>
                <div className="flex">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add new task..."
                        className="flex-grow p-1.5 text-xs border rounded-l-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    <button onClick={handleAddTask} className="text-white px-3 text-xs font-semibold rounded-r-md" style={{ backgroundColor: 'var(--primary)' }}>
                        Add
                    </button>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            userRole={userRole}
                            onToggle={() => onToggleTask(campusId, category, task.id)}
                            onDelete={() => onDeleteTask(campusId, category, task.id)}
                            onToggleFix={() => onToggleTaskFix(campusId, category, task.id)}
                        />
                    ))
                ) : (
                    <p className="p-4 text-xs text-center text-gray-500">No tasks for this category.</p>
                )}
            </div>
        </div>
    );
};

export default TaskCard;