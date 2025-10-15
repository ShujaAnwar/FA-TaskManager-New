import React, { useState } from 'react';
// FIX: Import CampusData to ensure proper type casting for campus data objects.
import { Bill, CampusId, AllCampusData, CampusData } from '../types';

interface BillsCardProps {
    campusId: CampusId;
    bills: Bill[];
    allData?: AllCampusData;
    onToggleBill: (campusId: CampusId, billIndex: number) => void;
    onAttachBill: (campusId: CampusId, billIndex: number, file: File) => void;
    onDeleteAttachment: (campusId: CampusId, billIndex: number) => void;
    onAddBill: (campusId: CampusId, billData: Omit<Bill, 'paid' | 'attachment'>) => void;
}

const BillItem: React.FC<{
    bill: Bill;
    index: number;
    campusId: CampusId;
    onToggleBill: (campusId: CampusId, billIndex: number) => void;
    onAttachBill: (campusId: CampusId, billIndex: number, file: File) => void;
    onDeleteAttachment: (campusId: CampusId, billIndex: number) => void;
}> = ({ bill, index, campusId, onToggleBill, onAttachBill, onDeleteAttachment }) => {
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onAttachBill(campusId, index, e.target.files[0]);
            e.target.value = '';
        }
    };
    
    return (
        <div className="p-1.5 border rounded-md text-xs flex flex-col justify-between" style={{ borderColor: 'var(--cream-dark)' }}>
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
                            onChange={handleFileChange}
                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

const BillsCard: React.FC<BillsCardProps> = ({ campusId, bills, allData, onToggleBill, onAttachBill, onDeleteAttachment, onAddBill }) => {
    const [newBillType, setNewBillType] = useState('');
    const [newBillAccount, setNewBillAccount] = useState('');

    const handleAddBill = () => {
        if (!newBillType.trim() || !newBillAccount.trim()) {
            alert("Bill type and account number are required.");
            return;
        }
        onAddBill(campusId, {
            type: newBillType,
            location: `${campusId.charAt(0).toUpperCase() + campusId.slice(1)} Campus`,
            account: newBillAccount
        });
        setNewBillType('');
        setNewBillAccount('');
    };

    if (allData) {
        // Aggregated view for Main Campus
        return (
            <div className="flex flex-col rounded-xl shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
                <div className="flex justify-between items-center p-2 border-b-2" style={{ borderColor: 'var(--cream-dark)', color: 'var(--text-color)' }}>
                    <h3 className="font-semibold text-sm">All Campus Utility Bills</h3>
                </div>
                <div className="p-2 space-y-4 max-h-[600px] overflow-y-auto">
                    {Object.entries(allData)
                        .filter(([cId]) => cId !== CampusId.ControlPanel)
                        .map(([cId, cData]) => {
                            // FIX: Cast `cData` to `CampusData` because `Object.entries` infers its type as `unknown`.
                            // This ensures type safety when accessing `cData.bills`.
                            const campusData = cData as CampusData;
                            return (
                            <div key={cId}>
                                <h4 className="font-bold text-xs uppercase p-2 rounded-md" style={{ backgroundColor: 'var(--cream-light)', color: 'var(--primary)'}}>
                                    <i className="fas fa-university mr-2"></i>{cId} Campus
                                </h4>
                                <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {campusData.bills.length > 0 ? (
                                        campusData.bills.map((bill, index) => (
                                            <BillItem 
                                                key={`${cId}-${index}`} 
                                                bill={bill} 
                                                index={index} 
                                                campusId={cId as CampusId}
                                                onToggleBill={onToggleBill}
                                                onAttachBill={onAttachBill}
                                                onDeleteAttachment={onDeleteAttachment}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500 md:col-span-2 text-center py-2">No bills for this campus.</p>
                                    )}
                                </div>
                            </div>
                        )})}
                </div>
            </div>
        );
    }
    
    // Single campus view
    const paidCount = bills.filter(b => b.paid).length;
    const totalCount = bills.length;
    const progress = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

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
                    <BillItem 
                        key={index} 
                        bill={bill} 
                        index={index} 
                        campusId={campusId}
                        onToggleBill={onToggleBill}
                        onAttachBill={onAttachBill}
                        onDeleteAttachment={onDeleteAttachment}
                    />
                ))}
            </div>
            <div className="p-2 border-t" style={{ borderColor: 'var(--cream-dark)' }}>
                <h4 className="text-xs font-semibold mb-2">Add New Bill</h4>
                <div className="space-y-2">
                    <input type="text" placeholder="Bill Type (e.g., K-Electric)" value={newBillType} onChange={(e) => setNewBillType(e.target.value)} className="w-full p-1.5 text-xs border rounded-md" style={{ backgroundColor: 'var(--cream-light)', borderColor: 'var(--cream-dark)' }}/>
                    <input type="text" placeholder="Account / Consumer #" value={newBillAccount} onChange={(e) => setNewBillAccount(e.target.value)} className="w-full p-1.5 text-xs border rounded-md" style={{ backgroundColor: 'var(--cream-light)', borderColor: 'var(--cream-dark)' }}/>
                    <button onClick={handleAddBill} className="w-full py-1.5 text-xs font-semibold text-white rounded-md transition hover:opacity-90" style={{ backgroundColor: 'var(--primary)' }}>
                       <i className="fas fa-plus mr-2"></i> Add Bill
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillsCard;