import React from 'react';
import { Bill, CampusId } from '../types';

interface BillsCardProps {
    campusId: CampusId;
    bills: Bill[];
    onToggleBill: (campusId: CampusId, billIndex: number) => void;
    onAttachBill: (campusId: CampusId, billIndex: number, file: File) => void;
    onDeleteAttachment: (campusId: CampusId, billIndex: number) => void;
}

const BillsCard: React.FC<BillsCardProps> = ({ campusId, bills, onToggleBill, onAttachBill, onDeleteAttachment }) => {
    const paidCount = bills.filter(b => b.paid).length;
    const totalCount = bills.length;
    const progress = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            onAttachBill(campusId, index, e.target.files[0]);
            e.target.value = '';
        }
    };

    return (
        <div className="flex flex-col rounded-xl shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="flex justify-between items-center p-2 border-b-2" style={{ borderColor: 'var(--cream-dark)', color: 'var(--text-color)' }}>
                <h3 className="font-semibold text-sm">Utility Bills</h3>
                 <span className="text-xs font-bold text-white rounded-full h-5 w-5 flex items-center justify-center bg-blue-500">
                    {bills.length}
                </span>
            </div>
            <div className="p-2 text-xs">
                 <div className="flex justify-between items-center mb-1">
                    <span>Payment Progress</span>
                    <span>{paidCount}/{totalCount} paid</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                 </div>
            </div>
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {bills.map((bill, index) => (
                    <div key={index} className="p-1.5 border rounded-md text-xs flex flex-col justify-between" style={{ borderColor: 'var(--cream-dark)' }}>
                        <div>
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    checked={bill.paid}
                                    onChange={() => onToggleBill(campusId, index)}
                                    id={`bill-${campusId}-${index}`}
                                    className="mt-1 mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label htmlFor={`bill-${campusId}-${index}`} className={`cursor-pointer ${bill.paid ? 'line-through opacity-60' : ''}`}>
                                    <div className="font-bold" style={{ color: 'var(--primary)'}}>{bill.type}</div>
                                    <div className="text-gray-500 text-[10px]">{bill.location}</div>
                                    <div className="text-gray-500 text-[10px] font-mono">{bill.account}</div>
                                </label>
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t flex items-center gap-4 text-xs" style={{ borderColor: 'var(--cream-dark)' }}>
                             {bill.attachment ? (
                                <>
                                    <a href={bill.attachment} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-green-600 hover:text-green-800 transition-colors">
                                        <i className="fas fa-eye"></i> View Bill
                                    </a>
                                    <button onClick={() => onDeleteAttachment(campusId, index)} className="flex items-center gap-1 font-semibold text-red-600 hover:text-red-800 transition-colors">
                                        <i className="fas fa-times"></i> Remove
                                    </button>
                                </>
                            ) : (
                                <>
                                    <label htmlFor={`bill-attachment-${campusId}-${index}`} className="flex items-center gap-1 cursor-pointer font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                                        <i className="fas fa-paperclip"></i> Attach Bill
                                    </label>
                                    <input
                                        type="file"
                                        id={`bill-attachment-${campusId}-${index}`}
                                        className="hidden"
                                        onChange={(e) => handleFileChange(e, index)}
                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BillsCard;