
import React from 'react';
import { CampusId, UserRole, AttendanceRecord } from '../types';

interface QuickActionsCardProps {
    campusId: CampusId;
    userRole: UserRole;
    onMarkAllTodayComplete: (campusId: CampusId) => void;
    onResetCampus: (campusId: CampusId) => void;
    onResetAll: () => void;
    onGenerateReport: (type: 'Daily' | 'Monthly') => void;
    onLogAttendance: (campusId: CampusId, type: 'in' | 'out') => void;
    attendance?: AttendanceRecord[];
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ campusId, userRole, onMarkAllTodayComplete, onResetCampus, onResetAll, onGenerateReport, onLogAttendance, attendance }) => {
    // Consistent use of local date string
    const todayStr = new Date().toLocaleDateString('en-CA');
    const record = attendance?.find(a => a.date === todayStr);

    return (
        <div className="rounded-xl shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="p-3 border-b-2" style={{ borderColor: 'var(--cream-dark)', color: 'var(--text-color)' }}>
                <h3 className="font-semibold text-sm">Command Center</h3>
            </div>
            <div className="p-3 space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Attendance Module</h4>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${record?.checkOut ? 'bg-orange-500/20 text-orange-500' : record?.checkIn ? 'bg-green-500/20 text-green-500 animate-pulse' : 'bg-gray-500/20 text-gray-500'}`}>
                            {record?.checkOut ? 'Signed Out' : record?.checkIn ? 'Signed In' : 'Not Logged'}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            disabled={!!record?.checkIn}
                            onClick={() => onLogAttendance(campusId, 'in')}
                            className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all border-2 ${!!record?.checkIn ? 'border-green-500/20 bg-green-500/5 text-green-500/50 grayscale' : 'border-green-500/10 bg-green-500/10 text-green-500 hover:scale-105 active:scale-95'}`}
                        >
                            <i className="fas fa-sign-in-alt text-lg"></i>
                            <span className="text-[9px] font-black uppercase">Check In</span>
                        </button>
                        <button
                            disabled={!record?.checkIn || !!record?.checkOut}
                            onClick={() => onLogAttendance(campusId, 'out')}
                            className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all border-2 ${!record?.checkIn || !!record?.checkOut ? 'border-orange-500/20 bg-orange-500/5 text-orange-500/50 grayscale' : 'border-orange-500/10 bg-orange-500/10 text-orange-500 hover:scale-105 active:scale-95'}`}
                        >
                            <i className="fas fa-sign-out-alt text-lg"></i>
                            <span className="text-[9px] font-black uppercase">Check Out</span>
                        </button>
                    </div>
                </div>

                <div className="border-t pt-3" style={{ borderColor: 'var(--cream-dark)' }}>
                    <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">Quick Commands</h4>
                    <div className="grid grid-cols-1 gap-2">
                        <button onClick={() => onMarkAllTodayComplete(campusId)} className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                            <i className="fas fa-check-double"></i>
                            <span>Mark Today Complete</span>
                        </button>
                        <button onClick={() => onResetCampus(campusId)} className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                            <i className="fas fa-redo"></i>
                            <span>Reset Campus Data</span>
                        </button>
                    </div>
                </div>

                <div className="border-t pt-3" style={{ borderColor: 'var(--cream-dark)' }}>
                    <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">Sync & Reports</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => onGenerateReport('Daily')} className="flex items-center justify-center gap-2 p-3 text-[10px] font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20">
                            <i className="fas fa-file-pdf"></i>
                            <span>Daily PDF</span>
                        </button>
                        <button onClick={() => onGenerateReport('Monthly')} className="flex items-center justify-center gap-2 p-3 text-[10px] font-bold text-white bg-slate-800 rounded-xl hover:bg-slate-900 transition shadow-lg shadow-slate-500/20">
                            <i className="fas fa-calendar-check"></i>
                            <span>Monthly PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickActionsCard;
