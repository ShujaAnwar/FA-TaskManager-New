
import React, { useMemo } from 'react';
import { AllCampusData, TaskCategory, Task, Bill, CampusData } from '../types';
import StatsCard from './StatsCard';

interface StatsOverviewProps {
    allData: AllCampusData;
}

const calculateProgress = (items: (Task | Bill)[], predicate: (item: any) => boolean) => {
    if (items.length === 0) return 0;
    const completed = items.filter(predicate).length;
    return Math.round((completed / items.length) * 100);
};


const StatsOverview: React.FC<StatsOverviewProps> = ({ allData }) => {
    const stats = useMemo(() => {
        // FIX: Filter out undefined campus data using a type guard.
        // AllCampusData can have undefined entries, which caused type errors and potential runtime crashes.
        // This ensures we only process valid CampusData objects.
        const validCampuses = Object.values(allData).filter((c): c is CampusData => !!c);

        const allTasks: Task[] = validCampuses.flatMap(campus => 
            Object.values(campus.tasks).flat()
        );
        const allBills: Bill[] = validCampuses.flatMap(campus => campus.bills);

        const dailyTasks = allTasks.filter(t => t.id.startsWith('D-') || t.id.startsWith('JD-') || t.id.endsWith('-today'));
        const weeklyTasks = allTasks.filter(t => t.id.startsWith('W-') || t.id.startsWith('JW-') || t.id.startsWith('MSJ-W') || t.id.startsWith('MKT-W'));
        const monthlyTasks = allTasks.filter(t => t.id.startsWith('M-') || t.id.startsWith('JM-') || t.id.startsWith('MSJ-') || t.id.startsWith('MKT-'));

        return {
            daily: calculateProgress(dailyTasks, item => item.completed),
            weekly: calculateProgress(weeklyTasks, item => item.completed),
            monthly: calculateProgress(monthlyTasks, item => item.completed),
            bills: calculateProgress(allBills, item => item.paid),
        };
    }, [allData]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatsCard icon="fas fa-sun" title="Daily Progress" value={`${stats.daily}%`} />
            <StatsCard icon="fas fa-calendar-week" title="Weekly Progress" value={`${stats.weekly}%`} />
            <StatsCard icon="fas fa-calendar-alt" title="Monthly Progress" value={`${stats.monthly}%`} />
            <StatsCard icon="fas fa-file-invoice-dollar" title="Bills Paid" value={`${stats.bills}%`} />
        </div>
    );
};

export default StatsOverview;