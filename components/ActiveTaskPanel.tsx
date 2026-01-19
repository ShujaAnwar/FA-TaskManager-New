
import React, { useState, useEffect } from 'react';
import { Task, CampusId, TaskCategory } from '../types';

interface ActiveTaskPanelProps {
    activeTask: Task | null;
    campusId: CampusId;
    category: TaskCategory;
    onPause: (cid: CampusId, cat: TaskCategory, tid: string) => void;
    onComplete: (cid: CampusId, cat: TaskCategory, tid: string) => void;
}

const ActiveTaskPanel: React.FC<ActiveTaskPanelProps> = ({ activeTask, campusId, category, onPause, onComplete }) => {
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        if (!activeTask) return;
        const updateTimer = () => {
            const currentSession = activeTask.sessions[activeTask.sessions.length - 1];
            if (!currentSession || currentSession.end) return;
            
            const totalMs = (Date.now() - currentSession.start) + (activeTask.actualMinutes * 60000);
            const totalSecs = Math.floor(totalMs / 1000);
            const h = Math.floor(totalSecs / 3600);
            const m = Math.floor((totalSecs % 3600) / 60);
            const s = totalSecs % 60;
            setElapsed(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        };

        const interval = setInterval(updateTimer, 1000);
        updateTimer();
        return () => clearInterval(interval);
    }, [activeTask]);

    if (!activeTask) return null;

    return (
        <div className="mb-6 p-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl animate-pulse-slow">
            <div className="bg-slate-900 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <i className="fas fa-bolt text-blue-500 text-xl animate-bounce"></i>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-black text-blue-400 tracking-widest">Active Execution</span>
                        <h2 className="text-xl font-bold text-white leading-tight">{activeTask.description}</h2>
                        <div className="flex gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-bold">EST: {activeTask.estimatedMinutes}m</span>
                            <span className="px-2 py-0.5 rounded text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase font-bold">{activeTask.id}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <div className="text-3xl font-mono font-black text-white tabular-nums tracking-tighter">{elapsed}</div>
                        <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Live Worked Time</span>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => onPause(campusId, category, activeTask.id)}
                            className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all flex items-center justify-center shadow-lg"
                        >
                            <i className="fas fa-pause text-lg"></i>
                        </button>
                        <button 
                            onClick={() => onComplete(campusId, category, activeTask.id)}
                            className="px-6 h-12 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg"
                        >
                            <i className="fas fa-check-double"></i>
                            <span>Complete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveTaskPanel;
