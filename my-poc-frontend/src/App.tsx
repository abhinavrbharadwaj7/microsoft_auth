// src/App.tsx
import React, { useEffect, useState } from 'react';
import msalInstance from './msalInstance';
import Profile from './components/Profile';
import Login from './components/Login';

interface User {
    microsoftId?: string;
    name?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
}

const App: React.FC = () => {
    const [isMsalInitialized, setIsMsalInitialized] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const initMsal = async () => {
            await msalInstance.initialize();
            setIsMsalInitialized(true);
        };
        initMsal();
    }, []);

    const handleLogin = (userInfo: User) => {
        const microsoftId = userInfo.microsoftId || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const userWithId = {
            ...userInfo,
            microsoftId
        };
        console.log('Setting user with ID:', userWithId);
        setIsAuthenticated(true);
        setUser(userWithId);
    };

    const handleUpdateProfile = (updatedUser: User) => {
        setUser(updatedUser); // Update user state with new details
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null); // Clear user state on logout
    };

    return (
        <div className="App">
            {isAuthenticated && user ? (
                <Profile
                    microsoftId={user.microsoftId!}  // Force non-null as we ensure it exists
                    name={user.name ?? "No name provided"}
                    email={user.email ?? "No email provided"}
                    phone={user.phone ?? ""}
                    avatarUrl={user.avatarUrl ?? "https://i.pravatar.cc/150?img=5"}
                    onUpdate={handleUpdateProfile}
                    onLogout={handleLogout}
                />
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
};

export default App;
