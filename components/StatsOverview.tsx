
import React, { useMemo } from 'react';
import { AllCampusData, Task, Bill, CampusData, TaskStatus } from '../types';

interface StatsOverviewProps {
    allData: AllCampusData;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ allData }) => {
    const metrics = useMemo(() => {
        if (!allData) return { totalTasks: 0, completed: 0, inProgress: 0, efficiency: 0, workedToday: 0, Terry: 0, pending: 0 };
        
        // FIX: Cast 'c' to 'any' when checking for 'tasks' to avoid property access error on 'object' type.
        const validCampuses = Object.values(allData).filter((c): c is CampusData => !!c && typeof c === 'object' && !!(c as any).tasks);
        const allTasks: Task[] = validCampuses.flatMap(c => {
            if (!c.tasks) return [];
            return Object.values(c.tasks).flatMap(t => Array.isArray(t) ? t : []);
        });
        
        const todayStr = new Date().toLocaleDateString('en-CA');
        
        const completedTasks = allTasks.filter(t => t.status === TaskStatus.Completed);
        const inProgressCount = allTasks.filter(t => t.status === TaskStatus.InProgress).length;
        
        const totalEst = completedTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
        const totalAct = completedTasks.reduce((sum, t) => sum + (t.actualMinutes || 0), 0);
        const efficiency = totalAct > 0 ? Math.round((totalEst / totalAct) * 100) : 0;

        // Sum up worked time from all campuses for today
        const workedToday = validCampuses.reduce((sum, campus) => {
            if (!campus.attendance) return sum;
            const record = campus.attendance.find(a => a.date === todayStr);
            if (record) {
                if (record.totalWorkMinutes) return sum + record.totalWorkMinutes;
                if (record.checkIn && !record.checkOut) {
                    // Estimate live time for the summary
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
            pending: allTasks.filter(t => t.status === TaskStatus.Assigned || t.status === TaskStatus.Paused).length
        };
    }, [allData]);

    const getEfficiencyColor = (eff: number) => {
        if (eff >= 100) return 'text-green-400';
        if (eff >= 80) return 'text-blue-400';
        return 'text-red-400';
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10">
                <span className="text-2xl font-black text-white">{metrics.totalTasks}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Total Tasks</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10">
                <span className="text-2xl font-black text-blue-400">{metrics.inProgress}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Live Active</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10">
                <span className="text-2xl font-black text-green-400">{metrics.completed}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Completed</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10">
                <span className="text-2xl font-black text-yellow-500">{metrics.pending}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Pending</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10">
                <span className={`text-2xl font-black ${getEfficiencyColor(metrics.efficiency)}`}>{metrics.efficiency}%</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Efficiency</span>
            </div>
            <div className="p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-inner bg-white/5 flex flex-col items-center justify-center transition hover:bg-white/10">
                <span className="text-2xl font-black text-purple-400">{Math.floor(metrics.workedToday / 60)}h {metrics.workedToday % 60}m</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">Work Duration</span>
            </div>
        </div>
    );
};

export default StatsOverview;
