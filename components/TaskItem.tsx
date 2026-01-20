
import React, { useState, useEffect } from 'react';
import { Task, UserRole, TaskStatus, Priority } from '../types';

interface TaskItemProps {
    task: Task;
    userRole: UserRole;
    onToggle: () => void;
    onDelete: () => void;
    onToggleFix: () => void;
    onStart: () => void;
    onPause: () => void;
    onUpdate?: (updates: Partial<Task>) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, userRole, onToggle, onDelete, onToggleFix, onStart, onPause, onUpdate }) => {
    const [liveMinutes, setLiveMinutes] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.description);

    useEffect(() => {
        let interval: number;
        if (task.status === TaskStatus.InProgress && task.timerStartedAt) {
            const update = () => {
                const elapsed = Date.now() - (task.timerStartedAt || 0);
                setLiveMinutes(Math.floor(elapsed / 60000));
            };
            update();
            interval = window.setInterval(update, 10000); 
        } else {
            setLiveMinutes(0);
        }
        return () => clearInterval(interval);
    }, [task.status, task.timerStartedAt]);

    const handleSave = () => {
        if (onUpdate && editValue.trim()) {
            onUpdate({ description: editValue });
            setIsEditing(false);
        }
    };

    const displayActual = (task.actualMinutes || 0) + liveMinutes;

    const getStatusLabel = () => {
        switch (task.status) {
            case TaskStatus.InProgress: return 'In Progress';
            case TaskStatus.Paused: return 'Paused';
            case TaskStatus.Completed: return 'Completed';
            case TaskStatus.Assigned: return 'Pending';
            default: return task.status.toUpperCase();
        }
    };

    const getStatusColor = () => {
        switch (task.status) {
            case TaskStatus.InProgress: return 'bg-green-500';
            case TaskStatus.Paused: return 'bg-yellow-500 text-black';
            case TaskStatus.Completed: return 'bg-blue-500';
            case TaskStatus.Assigned: return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    const getPriorityBadge = (p: Priority) => {
        switch (p) {
            case Priority.Urgent: return <span className="text-[8px] bg-red-600 text-white px-1 rounded font-black uppercase">Urgent</span>;
            case Priority.High: return <span className="text-[8px] bg-orange-500 text-white px-1 rounded font-black uppercase">High</span>;
            case Priority.Low: return <span className="text-[8px] bg-gray-400 text-white px-1 rounded font-black uppercase">Low</span>;
            default: return null;
        }
    };

    return (
        <div className={`flex flex-col p-2 border-b transition-colors hover:bg-white/40 ${task.priority === Priority.Urgent && !task.completed ? 'border-l-4 border-l-red-600' : ''} ${task.completed ? 'bg-gray-50/10' : ''}`} style={{ borderColor: 'var(--cream-dark)', color: 'var(--text-color)' }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-grow min-w-0">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={onToggle}
                        className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className={`flex flex-col min-w-0 ${task.completed ? 'opacity-60' : ''}`}>
                         <div className="flex items-center gap-1.5 flex-wrap">
                            {getPriorityBadge(task.priority)}
                            {task.isFixed && <i className="fas fa-lock text-[10px] text-gray-400"></i>}
                            <span className="font-bold text-[10px] whitespace-nowrap" style={{ color: 'var(--primary)'}}>{task.id}</span>
                            
                            {isEditing ? (
                                <div className="flex gap-1 items-center flex-grow">
                                    <input 
                                        autoFocus
                                        className="text-xs p-1 border rounded w-full"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                        onBlur={handleSave}
                                    />
                                </div>
                            ) : (
                                <span className={`text-xs font-semibold break-words ${task.completed ? 'line-through' : ''}`}>{task.description}</span>
                            )}
                         </div>
                         <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] text-white px-1.5 rounded-full uppercase font-bold ${getStatusColor()}`}>
                                {getStatusLabel()}
                            </span>
                            <span className="text-[9px] text-gray-500 font-mono">
                                Est: {task.estimatedMinutes}m | Act: {displayActual}m
                            </span>
                         </div>
                    </div>
                </div>
                
                <div className="flex items-center ml-2 space-x-1 shrink-0">
                    {!task.completed && (
                        <>
                            {task.status !== TaskStatus.InProgress ? (
                                <button onClick={onStart} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Start Timer">
                                    <i className="fas fa-play text-xs"></i>
                                </button>
                            ) : (
                                <button onClick={onPause} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded" title="Pause Timer">
                                    <i className="fas fa-pause text-xs"></i>
                                </button>
                            )}
                        </>
                    )}
                    <button onClick={() => setIsEditing(!isEditing)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded">
                        <i className={`fas ${isEditing ? 'fa-check text-green-600' : 'fa-edit'} text-xs`}></i>
                    </button>
                    <button onClick={onToggleFix} className="p-1.5 text-gray-400 hover:text-blue-600 rounded" title="Fix/Unfix">
                        <i className={`fas fa-thumbtack text-xs ${task.isFixed ? 'text-blue-600' : ''}`}></i>
                    </button>
                    {!task.isFixed && (
                        <button onClick={onDelete} className="p-1.5 text-red-400 hover:text-red-600 rounded">
                            <i className="fas fa-times text-xs"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
