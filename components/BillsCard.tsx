
import React, { useState } from 'react';
import { Bill, CampusId, AllCampusData, CampusData } from '../types';

interface BillsCardProps {
    campusId: CampusId;
    bills: Bill[];
    allData?: AllCampusData;
    onToggleBill: (campusId: CampusId, billIndex: number) => void;
    onUpdateBill: (campusId: CampusId, billIndex: number, updates: Partial<Bill>) => void;
    onAttachBill: (campusId: CampusId, billIndex: number, file: File) => void;
    onDeleteAttachment: (campusId: CampusId, billIndex: number) => void;
    onAddBill: (campusId: CampusId, billData: Omit<Bill, 'paid' | 'attachment'>) => void;
}

const BillItem: React.FC<{
    bill: Bill;
    index: number;
    campusId: CampusId;
    onToggleBill: (campusId: CampusId, billIndex: number) => void;
    onUpdateBill: (campusId: CampusId, billIndex: number, updates: Partial<Bill>) => void;
    onAttachBill: (campusId: CampusId, billIndex: number, file: File) => void;
    onDeleteAttachment: (campusId: CampusId, billIndex: number) => void;
}> = ({ bill, index, campusId, onToggleBill, onUpdateBill, onAttachBill, onDeleteAttachment }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ type: bill.type, account: bill.account });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onAttachBill(campusId, index, e.target.files[0]);
            e.target.value = '';
        }
    };

    const handleSave = () => {
        onUpdateBill(campusId, index, editData);
        setIsEditing(false);
    };
    
    return (
        <div className="p-2 border rounded-md text-xs flex flex-col justify-between" style={{ borderColor: 'var(--cream-dark)', backgroundColor: 'var(--cream-light)' }}>
            <div className="flex justify-between items-start mb-1">
                <div className="flex items-start flex-grow">
                    <input
                        type="checkbox"
                        checked={bill.paid}
                        onChange={() => onToggleBill(campusId, index)}
                        id={`bill-${campusId}-${index}`}
                        className="mt-1 mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="flex-grow">
                        {isEditing ? (
                            <div className="space-y-1">
                                <input 
                                    className="w-full p-1 border rounded"
                                    value={editData.type}
                                    onChange={e => setEditData({...editData, type: e.target.value})}
                                />
                                <input 
                                    className="w-full p-1 border rounded font-mono"
                                    value={editData.account}
                                    onChange={e => setEditData({...editData, account: e.target.value})}
                                />
                                <button onClick={handleSave} className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px]">Save</button>
                            </div>
                        ) : (
                            <label htmlFor={`bill-${campusId}-${index}`} className={`cursor-pointer ${bill.paid ? 'line-through opacity-60' : ''}`}>
                                <div className="font-bold flex items-center gap-2" style={{ color: 'var(--primary)'}}>
                                    {bill.type}
                                    <button onClick={(e) => { e.preventDefault(); setIsEditing(true); }} className="text-gray-400 hover:text-blue-500">
                                        <i className="fas fa-edit text-[9px]"></i>
                                    </button>
                                </div>
                                <div className="text-gray-500 text-[10px]">{bill.location}</div>
                                <div className="text-gray-500 text-[10px] font-mono">{bill.account}</div>
                            </label>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-2 pt-2 border-t flex items-center gap-4 text-[10px]" style={{ borderColor: 'var(--cream-dark)' }}>
                 {bill.attachment ? (
                    <>
                        <a href={bill.attachment} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-green-600 hover:text-green-800">
                            <i className="fas fa-eye"></i> View
                        </a>
                        <button onClick={() => onDeleteAttachment(campusId, index)} className="text-red-600 hover:text-red-800">
                            <i className="fas fa-times"></i>
                        </button>
                    </>
                ) : (
                    <label htmlFor={`bill-attachment-${campusId}-${index}`} className="flex items-center gap-1 cursor-pointer font-semibold text-blue-600 hover:text-blue-800">
                        <i className="fas fa-paperclip"></i> Attach Bill
                        <input type="file" id={`bill-attachment-${campusId}-${index}`} className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                    </label>
                )}
            </div>
        </div>
    );
};

const BillsCard: React.FC<BillsCardProps> = ({ campusId, bills, allData, onToggleBill, onUpdateBill, onAttachBill, onDeleteAttachment, onAddBill }) => {
    const [newBillType, setNewBillType] = useState('');
    const [newBillAccount, setNewBillAccount] = useState('');

    const handleAddBill = () => {
        if (!newBillType.trim() || !newBillAccount.trim()) return;
        onAddBill(campusId, { type: newBillType, location: `${campusId.charAt(0).toUpperCase() + campusId.slice(1)} Campus`, account: newBillAccount });
        setNewBillType('');
        setNewBillAccount('');
    };

    return (
        <div className="flex flex-col rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="flex justify-between items-center p-2 border-b-2" style={{ borderColor: 'var(--cream-dark)', color: 'var(--text-color)' }}>
                <h3 className="font-semibold text-sm">Utility Bill Management</h3>
                 <span className="text-xs font-bold text-white rounded-full h-5 w-5 flex items-center justify-center bg-blue-500">
                    {bills.length}
                </span>
            </div>
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                {bills.map((bill, index) => (
                    <BillItem 
                        key={index} 
                        bill={bill} 
                        index={index} 
                        campusId={campusId}
                        onToggleBill={onToggleBill}
                        onUpdateBill={onUpdateBill}
                        onAttachBill={onAttachBill}
                        onDeleteAttachment={onDeleteAttachment}
                    />
                ))}
            </div>
            <div className="p-3 border-t bg-gray-50/50" style={{ borderColor: 'var(--cream-dark)' }}>
                <h4 className="text-[10px] font-black uppercase text-gray-500 mb-2">Register New Billing Source</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" placeholder="Bill Type" value={newBillType} onChange={(e) => setNewBillType(e.target.value)} className="flex-grow p-2 text-xs border rounded-md" />
                    <input type="text" placeholder="Account #" value={newBillAccount} onChange={(e) => setNewBillAccount(e.target.value)} className="flex-grow p-2 text-xs border rounded-md" />
                    <button onClick={handleAddBill} className="px-4 py-2 text-xs font-bold text-white rounded-md bg-blue-600 hover:bg-blue-700">Add</button>
                </div>
            </div>
        </div>
    );
};

export default BillsCard;
