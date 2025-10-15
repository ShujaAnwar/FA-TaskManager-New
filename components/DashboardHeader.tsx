import React from 'react';
import { User } from '../types';
import useDateTime from '../hooks/useDateTime';

interface DashboardHeaderProps {
    user: User;
    onLogout: () => void;
    onSearch: (term: string) => void;
    onOpenSettings: () => void;
    isCloudSyncOn: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout, onSearch, onOpenSettings, isCloudSyncOn }) => {
    const { date, time } = useDateTime();

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--cream-light)' }}>
            <div className="flex-grow flex items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)'}}>Welcome, {user.name}!</h2>
                    <p className="text-sm opacity-80" style={{ color: 'var(--text-color)'}}>
                        You are logged in as {user.role === 'admin' ? 'an Admin' : `a Campus User for ${user.campusId.charAt(0).toUpperCase() + user.campusId.slice(1)}`}.
                    </p>
                </div>
                {isCloudSyncOn && (
                     <div className="flex items-center gap-2 text-green-600" title="Real-time cloud sync is active.">
                        <i className="fas fa-cloud"></i>
                        <span className="text-xs font-semibold">Synced</span>
                    </div>
                )}
            </div>
            <div className="flex flex-col items-end text-sm text-right">
                <div className="font-semibold" style={{ color: 'var(--primary)'}}>{date}</div>
                <div className="opacity-80" style={{ color: 'var(--text-color)'}}>{time}</div>
            </div>
            <div className="w-full sm:w-auto flex items-center gap-2">
                 <div className="relative flex-grow">
                    <input
                        type="search"
                        placeholder="Search tasks or bills..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--cream-dark)' }}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i className="fas fa-search text-gray-400"></i>
                    </div>
                </div>
                 <button
                    onClick={onOpenSettings}
                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow transition hover:opacity-90 flex items-center gap-2"
                    style={{ backgroundColor: 'var(--primary)' }}
                    aria-label="Open settings"
                >
                    <i className="fas fa-cog"></i>
                </button>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow transition hover:opacity-90 flex items-center gap-2"
                    style={{ backgroundColor: 'var(--primary)' }}
                >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardHeader;