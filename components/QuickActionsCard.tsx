
import React from 'react';
import { CampusId, UserRole } from '../types';

interface QuickActionsCardProps {
    campusId: CampusId;
    userRole: UserRole;
    onMarkAllTodayComplete: (campusId: CampusId) => void;
    onResetCampus: (campusId: CampusId) => void;
    onResetAll: () => void;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ campusId, userRole, onMarkAllTodayComplete, onResetCampus, onResetAll }) => {
    return (
        <div className="rounded-xl shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="p-2 border-b-2" style={{ borderColor: 'var(--cream-dark)', color: 'var(--text-color)' }}>
                <h3 className="font-semibold text-sm">Quick Actions</h3>
            </div>
            <div className="p-2 grid grid-cols-2 gap-2">
                 <button
                    onClick={() => onMarkAllTodayComplete(campusId)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition"
                >
                    <i className="fas fa-check"></i>
                    <span>Complete Today</span>
                </button>
                 <button
                    onClick={() => onResetCampus(campusId)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition"
                >
                    <i className="fas fa-trash"></i>
                    <span>Reset Campus</span>
                </button>
                {userRole === UserRole.Admin && (
                     <button
                        onClick={onResetAll}
                        className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                    >
                        <i className="fas fa-redo"></i>
                        <span>Reset All Data</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuickActionsCard;
