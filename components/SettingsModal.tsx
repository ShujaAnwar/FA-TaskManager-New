import React, { useRef } from 'react';
import { Theme } from '../types';

interface SettingsModalProps {
    onClose: () => void;
    onBackup: () => void;
    onRestore: (file: File) => void;
    currentTheme: Theme;
    lastLightTheme: Theme;
    onThemeChange: (themeName: string) => void;
    isCloudSyncOn: boolean;
    onToggleCloudSync: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onBackup, onRestore, currentTheme, lastLightTheme, onThemeChange, isCloudSyncOn, onToggleCloudSync }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleThemeToggle = () => {
        if (currentTheme.name === 'dark') {
            onThemeChange(lastLightTheme.name);
        } else {
            onThemeChange('dark');
        }
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onRestore(e.target.files[0]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity" onClick={onClose}>
            <div className="p-6 rounded-xl shadow-xl w-full max-w-lg" style={{ backgroundColor: 'var(--card-bg)'}} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--primary)'}}>
                        <i className="fas fa-cog mr-3"></i>Application Settings
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-times fa-lg"></i>
                    </button>
                </div>
                
                <div className="space-y-6">
                    {/* Appearance Section */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--cream-light)'}}>
                         <h4 className="font-semibold mb-3 text-md" style={{ color: 'var(--text-color)'}}>Appearance</h4>
                         <div className="flex items-center justify-between">
                            <span className="text-sm">Dark Mode</span>
                            <label htmlFor="theme-toggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="theme-toggle" className="sr-only" checked={currentTheme.name === 'dark'} onChange={handleThemeToggle} />
                                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform-gpu"></div>
                                </div>
                            </label>
                         </div>
                    </div>
                    
                    {/* Data Management Section */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--cream-light)'}}>
                        <h4 className="font-semibold mb-3 text-md" style={{ color: 'var(--text-color)'}}>Data Management</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button onClick={onBackup} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-md transition hover:opacity-90" style={{ backgroundColor: 'var(--primary)'}}>
                                <i className="fas fa-download"></i>
                                <span>Backup Data</span>
                            </button>
                             <button onClick={handleRestoreClick} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md transition hover:bg-green-700">
                                <i className="fas fa-upload"></i>
                                <span>Restore Data</span>
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
                        </div>
                    </div>

                    {/* Sync Section */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--cream-light)'}}>
                         <h4 className="font-semibold mb-3 text-md" style={{ color: 'var(--text-color)'}}>Connectivity</h4>
                         <div className="flex items-center justify-between">
                            <span className="text-sm">Cloud Sync <small className="opacity-70">(Simulated)</small></span>
                            <label htmlFor="sync-toggle" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="sync-toggle" className="sr-only" checked={isCloudSyncOn} onChange={onToggleCloudSync} />
                                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform-gpu"></div>
                                </div>
                            </label>
                         </div>
                    </div>
                </div>

                <style>{`
                    input:checked ~ .dot {
                        transform: translateX(100%);
                        background-color: #48bb78;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default SettingsModal;