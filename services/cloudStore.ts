
import { AllCampusData, User } from '../types';
import { INITIAL_DATA, USERS } from '../constants';

const DATA_KEY = 'fiqh-academy-data';
const USERS_KEY = 'fiqh-academy-users';

// Helper to get data, initializing from constants if not present
const initializeAndGetData = (): AllCampusData => {
    try {
        const storedData = localStorage.getItem(DATA_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (e) {
        console.error("Failed to parse data from localStorage, resetting.", e);
    }
    const initialData = JSON.parse(JSON.stringify(INITIAL_DATA));
    localStorage.setItem(DATA_KEY, JSON.stringify(initialData));
    return initialData;
};

// Helper to get users, initializing from constants if not present
const initializeAndGetUsers = (): User[] => {
    try {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
    } catch (e) {
        console.error("Failed to parse users from localStorage, resetting.", e);
    }
    const initialUsers = JSON.parse(JSON.stringify(USERS));
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
};

// Initialize on module load to ensure localStorage is populated on first run
initializeAndGetData();
initializeAndGetUsers();

export const cloudStore = {
    getData: (): AllCampusData => {
        // Always read from localStorage to ensure we have the latest data,
        // which is crucial for cross-tab synchronization.
        const storedData = localStorage.getItem(DATA_KEY);
        // The initialization logic ensures storedData is never null.
        return JSON.parse(storedData!);
    },
    setData: (newData: AllCampusData) => {
        localStorage.setItem(DATA_KEY, JSON.stringify(newData));
    },
    getUsers: (): User[] => {
        // Always read from localStorage for consistency.
        const storedUsers = localStorage.getItem(USERS_KEY);
        return JSON.parse(storedUsers!);
    },
    setUsers: (newUsers: User[]) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
    },
    reset: () => {
        const initialData = JSON.parse(JSON.stringify(INITIAL_DATA));
        const initialUsers = JSON.parse(JSON.stringify(USERS));
        localStorage.setItem(DATA_KEY, JSON.stringify(initialData));
        localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    }
};
