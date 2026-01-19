
import React, { useMemo } from 'react';
import { AllCampusData, Task, Bill, CampusData, TaskStatus, Priority } from '../types';

interface StatsOverviewProps {
    allData: AllCampusData;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ allData }) => {
    const metrics = useMemo(() => {
        if (!allData) return { totalTasks: 0, completed: 0, inProgress: 0, efficiency: 0, workedToday: 0, pending: 0, statusDist: { completed: 0, inProgress: 0, pending: 0 } };
        
        const validCampuses = Object.values(allData).filter((c): c is CampusData => !!c && typeof c === 'object' && !!(c as any).tasks);
        const allTasks: Task[] = validCampuses.flatMap(c => {
            if (!c.tasks) return [];
            return Object.values(c.tasks).flatMap(t => Array.isArray(t) ? t : []);
        });
        
        const todayStr = new Date().toLocaleDateString('en-CA');
        
        const completedTasks = allTasks.filter(t => t.status === TaskStatus.Completed);
        const inProgressCount = allTasks.filter(t => t.status === TaskStatus.InProgress).length;
        const pendingCount = allTasks.filter(t => t.status === TaskStatus.Assigned || t.status === TaskStatus.Paused).length;
        
        const totalEst = completedTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
        const totalAct = completedTasks.reduce((sum, t) => sum + (t.actualMinutes || 0), 0);
        const efficiency = totalAct > 0 ? Math.round((totalEst / totalAct) * 100) : 0;

        const workedToday = validCampuses.reduce((sum, campus) => {
            if (!campus.attendance) return sum;
            const record = campus.attendance.find(a => a.date === todayStr);
            if (record) {
                if (record.totalWorkMinutes) return sum + record.totalWorkMinutes;
                if (record.checkIn && !record.checkOut) {
                    return sum + Math.round((Date.now() - record.checkIn) / 60000);
                }
            }
            return sum;
        }, 0);

        return {
            totalTasks: allTasks.length,
            completed: completedTasks.length,
            inProgress: inProgressCount,
            efficiency,
            workedToday,
            pending: pendingCount,
            statusDist: { completed: completedTasks.length, inProgress: inProgressCount, pending: pendingCount }
        };
    }, [allData]);

    const getEfficiencyColor = (eff: number) => {
        if (eff >= 100) return 'text-green-400';
        if (eff >= 80) return 'text-blue-400';
        return 'text-red-400';
    };

    const completionRate = metrics.totalTasks > 0 ? Math.round((metrics.completed / metrics.totalTasks) * 100) : 0;

    return (
        <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10 group">
                    <span className="text-2xl font-black text-white group-hover:scale-110 transition-transform">{metrics.totalTasks}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1 text-center">Total Scope</span>
                </div>
                <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10 group">
                    <span className="text-2xl font-black text-blue-400 group-hover:scale-110 transition-transform">{metrics.inProgress}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1 text-center">Live Active</span>
                </div>
                <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10 group">
                    <span className="text-2xl font-black text-green-400 group-hover:scale-110 transition-transform">{metrics.completed}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1 text-center">Fulfilled</span>
                </div>
                <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10 group">
                    <span className="text-2xl font-black text-yellow-500 group-hover:scale-110 transition-transform">{metrics.pending}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1 text-center">Backlog</span>
                </div>
                <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10 group">
                    <span className={`text-2xl font-black ${getEfficiencyColor(metrics.efficiency)} group-hover:scale-110 transition-transform`}>{metrics.efficiency}%</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1 text-center">Yield Index</span>
                </div>
                <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10 group">
                    <span className="text-2xl font-black text-purple-400 group-hover:scale-110 transition-transform">{Math.floor(metrics.workedToday / 60)}h {metrics.workedToday % 60}m</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1 text-center">Session Total</span>
                </div>
            </div>

            {/* Visual Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                    <div className="flex justify-between items-end mb-4">
                        <h4 className="text-xs font-black uppercase tracking-tighter text-gray-400">Task Performance Index</h4>
                        <span className="text-lg font-black text-green-400">{completionRate}%</span>
                    </div>
                    <div className="h-6 w-full bg-slate-800/50 rounded-full overflow-hidden flex border border-white/5">
                        <div className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-3 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                        <span>Initiated</span>
                        <span>{metrics.completed} / {metrics.totalTasks} Completed</span>
                    </div>
                </div>

                <div className="p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
                    <h4 className="text-xs font-black uppercase tracking-tighter text-gray-400 mb-4">Operational Distribution</h4>
                    <div className="flex items-center gap-4 h-6">
                        {metrics.totalTasks > 0 ? (
                            <>
                                <div className="h-full bg-green-500 transition-all rounded-l-md" style={{ width: `${(metrics.statusDist.completed / metrics.totalTasks) * 100}%` }} title="Completed"></div>
                                <div className="h-full bg-blue-500 transition-all" style={{ width: `${(metrics.statusDist.inProgress / metrics.totalTasks) * 100}%` }} title="In Progress"></div>
                                <div className="h-full bg-slate-600 transition-all rounded-r-md" style={{ width: `${(metrics.statusDist.pending / metrics.totalTasks) * 100}%` }} title="Pending"></div>
                            </>
                        ) : (
                            <div className="h-full w-full bg-slate-800/30 rounded-md"></div>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Fulfilled</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Executing</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Awaiting</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsOverview;
