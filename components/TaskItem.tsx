import React from 'react';
import { Task, UserRole } from '../types';

interface TaskItemProps {
    task: Task;
    userRole: UserRole;
    onToggle: () => void;
    onDelete: () => void;
    onToggleFix: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, userRole, onToggle, onDelete, onToggleFix }) => {
    const isAdmin = userRole === UserRole.Admin;

    return (
        <div className="flex items-center justify-between p-2 border-b transition-colors hover:bg-opacity-50" style={{ borderColor: 'var(--cream-dark)', color: 'var(--text-color)' }}>
            <div className="flex items-center flex-grow min-w-0">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={onToggle}
                    id={`task-${task.id}`}
                    className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={`task-${task.id}`} className={`flex-grow min-w-0 break-words cursor-pointer flex items-center ${task.completed ? 'line-through opacity-60' : ''}`}>
                    {task.isFixed && <i className="fas fa-lock text-xs mr-2 text-gray-400" title="This task is fixed and cannot be deleted by users."></i>}
                    <span className="font-bold text-xs mr-1" style={{ color: 'var(--primary)'}}>{task.id}</span>
                    <span className="text-xs">{task.description}</span>
                </label>
            </div>
            <div className="flex items-center ml-2 space-x-2">
                {isAdmin && (
                    <button
                        onClick={onToggleFix}
                        className="text-gray-500 hover:text-gray-700 text-xs opacity-70 hover:opacity-100 transition-opacity"
                        aria-label={task.isFixed ? `Un-fix task ${task.description}` : `Fix task ${task.description}`}
                        title={task.isFixed ? 'Un-fix task (makes it deletable)' : 'Fix task (prevents deletion)'}
                    >
                        <i className={`fas fa-thumbtack ${task.isFixed ? 'text-blue-600' : ''}`}></i>
                    </button>
                )}
                {!task.isFixed && (
                    <button
                        onClick={onDelete}
                        className="text-red-500 hover:text-red-700 text-xs opacity-70 hover:opacity-100 transition-opacity"
                        aria-label={`Delete task ${task.description}`}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskItem;