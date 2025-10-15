import React, { useState, useEffect } from 'react';
import { THEMES } from './constants';
import { Theme, User } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { databaseService } from './services/database';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [theme, setTheme] = useState<Theme>(THEMES[0]);
    const [lastLightTheme, setLastLightTheme] = useState<Theme>(THEMES[0]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Apply theme colors to the document
        Object.entries(theme.colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value as string);
        });
        const bodyStyle = `linear-gradient(135deg, ${theme.colors['--bg-gradient-start']}, ${theme.colors['--bg-gradient-end']})`;
        document.body.style.background = bodyStyle;
        document.body.style.color = theme.colors['--text-color'];

        // Persist theme preference
        localStorage.setItem('theme-name', theme.name);
        if (theme.name !== 'dark') {
            localStorage.setItem('last-light-theme-name', theme.name);
        }
    }, [theme]);

    useEffect(() => {
        // Load initial theme from localStorage
        const savedThemeName = localStorage.getItem('theme-name') || 'cream';
        const savedLastLightThemeName = localStorage.getItem('last-light-theme-name') || 'cream';
        
        const initialTheme = THEMES.find(t => t.name === savedThemeName) || THEMES[0];
        const initialLastLightTheme = THEMES.find(t => t.name === savedLastLightThemeName) || THEMES[0];

        setTheme(initialTheme);
        setLastLightTheme(initialLastLightTheme);

        const fetchInitialUsers = async () => {
            setIsLoading(true);
            const usersFromDb = await databaseService.getAllUsers();
            setUsers(usersFromDb);
            setIsLoading(false);
        };
        fetchInitialUsers();

        // Real-time synchronization for user data
        const syncChannel = new BroadcastChannel('dashboard-sync');
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'USERS_UPDATED') {
                databaseService.getAllUsers().then(setUsers);
            }
        };

        syncChannel.addEventListener('message', handleMessage);

        return () => {
            syncChannel.removeEventListener('message', handleMessage);
            syncChannel.close();
        };
    }, []);
    

    const handleLogin = (username: string, pass: string, rememberMe: boolean): boolean => {
        const user = users.find(u => u.username === username && u.password === pass);
        if (user) {
            const { password, ...userToStore } = user;
            setCurrentUser(userToStore);
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
                localStorage.setItem('rememberedPassword', pass);
            } else {
                localStorage.removeItem('rememberedUsername');
                localStorage.removeItem('rememberedPassword');
            }
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleThemeChange = (themeName: string) => {
        const newTheme = THEMES.find(t => t.name === themeName);
        if (newTheme) {
            setTheme(newTheme);
            if (newTheme.name !== 'dark') {
                setLastLightTheme(newTheme);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ color: 'var(--text-color)' }}>
                <div className="flex flex-col items-center">
                    <i className="fas fa-spinner fa-spin fa-3x"></i>
                    <p className="mt-4 text-lg">Loading Application...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="transition-all duration-300">
            {currentUser ? (
                <Dashboard
                    user={currentUser}
                    onLogout={handleLogout}
                    currentTheme={theme}
                    onThemeChange={handleThemeChange}
                    lastLightTheme={lastLightTheme}
                    users={users}
                    setUsers={setUsers}
                />
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
};

export default App;