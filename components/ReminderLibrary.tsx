
import React, { useState } from 'react';
import { Task, TaskCategory, CampusId, Priority } from '../types';

interface ReminderLibraryProps {
    campusId: CampusId;
    tasks: {
        [key in TaskCategory]: Task[];
    };
    onAddToToday: (task: Task) => void;
    onAddTask: (campusId: CampusId, category: TaskCategory, description: string, estMinutes: number, priority: Priority) => void;
    onUpdateTask: (campusId: CampusId, category: TaskCategory, taskId: string, updates: Partial<Task>) => void;
    onDeleteTask: (campusId: CampusId, category: TaskCategory, taskId: string) => void;
}

const ReminderLibrary: React.FC<ReminderLibraryProps> = ({ campusId, tasks, onAddToToday, onAddTask, onUpdateTask, onDeleteTask }) => {
    const [activeTab, setActiveTab] = useState<TaskCategory>(TaskCategory.Daily);
    const [isAdding, setIsAdding] = useState(false);
    const [newDesc, setNewDesc] = useState('');
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editDesc, setEditDesc] = useState('');

    const categories = [
        { id: TaskCategory.Daily, label: 'Daily', icon: 'fa-sun' },
        { id: TaskCategory.Weekly, label: 'Weekly', icon: 'fa-calendar-week' },
        { id: TaskCategory.Monthly, label: 'Monthly', icon: 'fa-calendar-alt' },
    ];

    const handleAdd = () => {
        if (!newDesc.trim()) return;
        onAddTask(campusId, activeTab, newDesc, 0, Priority.Medium);
        setNewDesc('');
        setIsAdding(false);
    };

    const handleStartEdit = (task: Task) => {
        setEditingTaskId(task.id);
        setEditDesc(task.description);
    };

    const handleSaveEdit = () => {
        if (editingTaskId && editDesc.trim()) {
            onUpdateTask(campusId, activeTab, editingTaskId, { description: editDesc });
            setEditingTaskId(null);
        }
    };

    return (
        <div className="rounded-xl shadow-lg border border-white/10 overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="p-3 border-b-2 flex justify-between items-center" style={{ borderColor: 'var(--cream-dark)', color: 'var(--text-color)' }}>
                <div className="flex items-center gap-2">
                    <i className="fas fa-bookmark text-blue-500"></i>
                    <h3 className="font-semibold text-sm">Reminder Library</h3>
                </div>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-[10px] font-black px-2 py-1 bg-blue-500 text-white rounded uppercase tracking-tighter hover:bg-blue-600 transition"
                >
                    <i className={`fas ${isAdding ? 'fa-times' : 'fa-plus'} mr-1`}></i>
                    {isAdding ? 'Cancel' : `Add ${activeTab}`}
                </button>
            </div>
            
            <div className="flex border-b" style={{ borderColor: 'var(--cream-dark)' }}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => { setActiveTab(cat.id); setIsAdding(false); setEditingTaskId(null); }}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === cat.id ? 'text-blue-500 border-b-2 border-blue-500 bg-blue-50/50' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <i className={`fas ${cat.icon} mr-1`}></i>
                        {cat.label}
                    </button>
                ))}
            </div>

            {isAdding && (
                <div className="p-2 border-b bg-blue-50/30" style={{ borderColor: 'var(--cream-dark)' }}>
                    <div className="flex gap-1">
                        <input 
                            type="text" 
                            autoFocus
                            placeholder={`New ${activeTab} reminder...`}
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            className="flex-grow text-xs p-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                        <button onClick={handleAdd} className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700">
                            <i className="fas fa-check text-xs"></i>
                        </button>
                    </div>
                </div>
            )}

            <div className="p-2 max-h-[300px] overflow-y-auto space-y-1">
                {tasks[activeTab].length > 0 ? (
                    tasks[activeTab].map(reminder => (
                        <div key={reminder.id} className="group flex flex-col p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                            {editingTaskId === reminder.id ? (
                                <div className="flex gap-1">
                                    <input 
                                        type="text" 
                                        autoFocus
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                        className="flex-grow text-xs p-1.5 border rounded"
                                    />
                                    <button onClick={handleSaveEdit} className="p-1.5 bg-green-500 text-white rounded">
                                        <i className="fas fa-save text-xs"></i>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col min-w-0 pr-2">
                                        <span className="text-xs font-semibold text-gray-700 truncate">{reminder.description}</span>
                                        <span className="text-[8px] text-gray-400 font-mono uppercase">{reminder.id}</span>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <button 
                                            onClick={() => onAddToToday(reminder)}
                                            className="p-1.5 bg-blue-500 text-white rounded-md transition-all hover:bg-blue-600 active:scale-95 shadow-sm"
                                            title="Add to Today"
                                        >
                                            <i className="fas fa-plus text-[8px]"></i>
                                        </button>
                                        <button 
                                            onClick={() => handleStartEdit(reminder)}
                                            className="p-1.5 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300"
                                            title="Edit"
                                        >
                                            <i className="fas fa-edit text-[8px]"></i>
                                        </button>
                                        <button 
                                            onClick={() => onDeleteTask(campusId, activeTab, reminder.id)}
                                            className="p-1.5 bg-red-100 text-red-500 rounded-md hover:bg-red-500 hover:text-white"
                                            title="Delete"
                                        >
                                            <i className="fas fa-trash text-[8px]"></i>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center text-gray-400 italic">
                        <i className="fas fa-ghost mb-2 block opacity-20 text-2xl"></i>
                        <span className="text-[10px]">No {activeTab} templates.</span>
                    </div>
                )}
            </div>
            
            <div className="p-2 bg-gray-50/50 rounded-b-xl border-t text-[9px] text-gray-400 italic text-center">
                Reminders are library items. Click + to instantiate to Today.
            </div>
        </div>
    );
};

export default ReminderLibrary;
