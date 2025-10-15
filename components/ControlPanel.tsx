
import React, { useState } from 'react';
import { User } from '../types';
import UserFormModal from './UserFormModal';

interface ControlPanelProps {
    users: User[];
    currentUser: User;
    onAddUser: (user: Omit<User, 'id'>) => void;
    onUpdateUser: (user: User) => void;
    onDeleteUser: (userId: number) => void;
}

const PasswordDisplay: React.FC<{ value: string }> = ({ value }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="flex items-center gap-2 font-mono">
            <span>{show ? value : '••••••••'}</span>
            <button onClick={() => setShow(!show)} className="text-gray-500 hover:text-gray-700" aria-label={show ? "Hide password" : "Show password"}>
                <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
        </div>
    );
};

const ControlPanel: React.FC<ControlPanelProps> = ({ users, currentUser, onAddUser, onUpdateUser, onDeleteUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleOpenModal = (user: User | null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingUser(null);
        setIsModalOpen(false);
    };
    
    const handleSaveUser = (user: User) => {
        if (editingUser) {
            onUpdateUser(user);
        } else {
            const { id, ...newUser } = user;
            onAddUser(newUser);
        }
        handleCloseModal();
    }

    return (
      <div className="p-4 rounded-xl shadow-lg" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary)'}}>User Management</h2>
          <button onClick={() => handleOpenModal(null)} className="px-4 py-2 text-sm font-semibold text-white rounded-md transition hover:opacity-90" style={{ backgroundColor: 'var(--primary)' }}>
            <i className="fas fa-plus mr-2"></i>Add User
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" style={{ color: 'var(--text-color)'}}>
            <thead className="text-xs uppercase" style={{ backgroundColor: 'var(--cream-light)'}}>
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Campus</th>
                <th scope="col" className="px-6 py-3">Password</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b" style={{ borderColor: 'var(--cream-dark)' }}>
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4 capitalize">{user.role.replace('_', ' ')}</td>
                  <td className="px-6 py-4 capitalize">{user.campusId}</td>
                  <td className="px-6 py-4"><PasswordDisplay value={user.password || ''} /></td>
                  <td className="px-6 py-4 flex gap-4">
                    <button onClick={() => handleOpenModal(user)} className="font-medium text-blue-600 hover:underline">Edit</button>
                    <button 
                        onClick={() => onDeleteUser(user.id)} 
                        disabled={user.id === currentUser.id}
                        className="font-medium text-red-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                        aria-disabled={user.id === currentUser.id}
                    >
                        Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
            <UserFormModal 
                user={editingUser}
                onSave={handleSaveUser}
                onClose={handleCloseModal}
            />
        )}
      </div>
    );
};

export default ControlPanel;
