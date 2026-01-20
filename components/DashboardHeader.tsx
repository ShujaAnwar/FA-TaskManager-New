
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
    const isRemoteConnected = !!localStorage.getItem('remote-api-url');

    const handleShareMyLogin = async () => {
        const shareText = `Fiqh Academy Task Manager Credentials:\n\nName: ${user.name}\nUsername: ${user.username}\nPassword: (Use your secure password)\n\nLogin here: ${window.location.origin}${window.location.pathname}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Fiqh Academy Access',
                    text: shareText,
                });
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                alert("Login info (without password) copied to clipboard!");
            } catch (err) {
                alert("Failed to copy info.");
            }
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--cream-light)' }}>
            <div className="flex-grow flex items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--primary)'}}>
                        Welcome, {user.name}!
                        <button 
                            onClick={handleShareMyLogin}
                            className="text-sm p-1 hover:text-blue-500 transition-colors opacity-70"
                            title="Share my login info"
                        >
                            <i className="fas fa-share-alt"></i>
                        </button>
                    </h2>
                    <div className="flex items-center gap-3">
                        <p className="text-xs opacity-80" style={{ color: 'var(--text-color)'}}>
                            {user.role === 'admin' ? 'Admin Access' : `${user.campusId.toUpperCase()} Campus Access`}
                        </p>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${isRemoteConnected ? 'bg-indigo-600 text-white' : 'bg-gray-400/20 text-gray-500'}`}>
                            <i className={`fas ${isRemoteConnected ? 'fa-cloud' : 'fa-hdd'}`}></i>
                            <span>{isRemoteConnected ? 'MongoDB Live' : 'Local Storage'}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end text-sm text-right">
                <div className="font-semibold" style={{ color: 'var(--primary)'}}>{date}</div>
                <div className="opacity-80" style={{ color: 'var(--text-color)'}}>{time}</div>
            </div>
            <div className="w-full sm:w-auto flex items-center gap-2">
                 <div className="relative flex-grow">
                    <input
                        type="search"
                        placeholder="Search dashboard..."
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
