import React from 'react';
import { AllCampusData, CampusId, CampusData, Task, Bill } from '../types';

interface AllCampusesOverviewProps {
    allData: AllCampusData;
    onSelectCampus: (campusId: CampusId) => void;
}

const calculateProgress = (items: (Task | Bill)[], predicate: (item: any) => boolean): number => {
    if (items.length === 0) return 100;
    const completed = items.filter(predicate).length;
    return Math.round((completed / items.length) * 100);
};


const CampusSummaryCard: React.FC<{
    campusId: CampusId;
    campusData: CampusData;
    onSelectCampus: (campusId: CampusId) => void;
}> = ({ campusId, campusData, onSelectCampus }) => {

    // FIX: Replaced `.flat()` with a more robust `.reduce()` operation for flattening the array.
    // While `.flat()` is simpler, certain TypeScript configurations can cause it to lose type information.
    // To ensure type safety with reduce, we provide a generic type `<Task[]>` to correctly type the accumulator.
    // FIX: Cast `tasks` to `Task[]` because `Object.values` infers its type as `unknown` in this context.
    const allTasks: Task[] = Object.values(campusData.tasks).reduce<Task[]>((acc, tasks) => acc.concat(tasks as Task[]), []);
    const taskProgress = calculateProgress(allTasks, task => task.completed);
    const billProgress = calculateProgress(campusData.bills, bill => bill.paid);
    const campusName = campusId.charAt(0).toUpperCase() + campusId.slice(1);

    return (
        <div className="p-4 rounded-lg flex flex-col justify-between" style={{ backgroundColor: 'var(--cream-light)', borderLeft: '4px solid var(--primary)' }}>
            <div>
                <h4 className="font-bold text-md" style={{ color: 'var(--primary)'}}>{campusName} Campus</h4>
                <div className="mt-2 text-xs space-y-2">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span>Task Progress</span>
                            <span className="font-semibold">{taskProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${taskProgress}%`, backgroundColor: 'var(--primary)' }}></div>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <span>Bills Paid</span>
                            <span className="font-semibold">{billProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${billProgress}%`, backgroundColor: 'var(--primary)' }}></div>
                        </div>
                    </div>
                </div>
            </div>
            <button
                onClick={() => onSelectCampus(campusId)}
                className="mt-4 w-full text-xs font-semibold py-1.5 rounded-md text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)' }}
            >
                View Details
            </button>
        </div>
    );
};


const AllCampusesOverview: React.FC<AllCampusesOverviewProps> = ({ allData, onSelectCampus }) => {
    const campusesToDisplay = Object.entries(allData).filter(
        ([campusId]) => campusId !== CampusId.Main && campusId !== CampusId.ControlPanel
    );

    return (
        <div className="mb-4">
            <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--primary)'}}>All Campuses Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {campusesToDisplay.map(([campusId, campusData]) => (
                    campusData && (
                        <CampusSummaryCard
                            key={campusId}
                            campusId={campusId as CampusId}
                            campusData={campusData}
                            onSelectCampus={onSelectCampus}
                        />
                    )
                ))}
            </div>
        </div>
    );
};

export default AllCampusesOverview;
