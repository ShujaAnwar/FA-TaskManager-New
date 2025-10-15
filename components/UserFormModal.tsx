
import React, { useState } from 'react';
import { User, UserRole, CampusId } from '../types';

interface UserFormModalProps {
    user: User | null;
    onSave: (user: User) => void;
    onClose: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        name: user?.name || '',
        username: user?.username || '',
        password: '',
        role: user?.role || UserRole.CampusUser,
        campusId: user?.campusId || CampusId.Main,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.username) {
            alert('Name and Username are required.');
            return;
        }

        const finalData: Partial<User> = { ...formData };
        if (user && !finalData.password) {
            delete finalData.password;
        } else if (!user && !finalData.password) {
            finalData.password = 'password'; // Default password for new users if not set
        }

        onSave({ ...user, ...finalData } as User);
    };

    const campusOptions = Object.values(CampusId).filter(c => c !== CampusId.ControlPanel);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="p-6 rounded-lg shadow-xl w-full max-w-md" style={{ backgroundColor: 'var(--card-bg)'}} onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--primary)'}}>
                    {user ? 'Edit User' : 'Add New User'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md" style={{ backgroundColor: 'var(--cream-light)', borderColor: 'var(--cream-dark)' }} />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
                        <input id="username" type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full p-2 border rounded-md" style={{ backgroundColor: 'var(--cream-light)', borderColor: 'var(--cream-dark)' }} />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                        <input id="password" type="password" name="password" value={formData.password || ''} onChange={handleChange} placeholder={user ? "Leave blank to keep current" : "Default is 'password'"} className="w-full p-2 border rounded-md" style={{ backgroundColor: 'var(--cream-light)', borderColor: 'var(--cream-dark)' }} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium mb-1">Role</label>
                            <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md" style={{ backgroundColor: 'var(--cream-light)', borderColor: 'var(--cream-dark)' }}>
                                {/* FIX: Cast role to string to fix type error with `.replace()` */}
                                {Object.values(UserRole).map(role => <option key={role} value={role} className="capitalize">{(role as string).replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="campusId" className="block text-sm font-medium mb-1">Campus</label>
                            <select id="campusId" name="campusId" value={formData.campusId} onChange={handleChange} className="w-full p-2 border rounded-md" style={{ backgroundColor: 'var(--cream-light)', borderColor: 'var(--cream-dark)' }}>
                                {campusOptions.map(campus => <option key={campus} value={campus} className="capitalize">{campus}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-white rounded-md" style={{ backgroundColor: 'var(--primary)'}}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;
