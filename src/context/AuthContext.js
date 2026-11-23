import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@reactpoc_auth_session';
const USERS_STORAGE_KEY = '@reactpoc_registered_users';

const DEFAULT_USER = {
  id: 'usr_1',
  name: 'Hayesha Perera',
  email: 'hayesha@example.com',
  role: 'Full Stack Developer',
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthSession();
  }, []);

  const checkAuthSession = async () => {
    try {
      const session = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch (e) {
      console.warn('Failed to restore auth session', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check local registered users list or fallback to demo account
    let registeredUsers = [];
    try {
      const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        registeredUsers = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading registered users', e);
    }

    const matchedUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    let loggedInUser;
    if (matchedUser) {
      const { password: _, ...userWithoutPass } = matchedUser;
      loggedInUser = userWithoutPass;
    } else if (trimmedEmail === DEFAULT_USER.email.toLowerCase() && password === 'password123') {
      loggedInUser = DEFAULT_USER;
    } else if (password.length >= 6) {
      // Allow flexible login for POC if password is >= 6 chars
      loggedInUser = {
        id: 'usr_' + Date.now(),
        name: trimmedEmail.split('@')[0].replace('.', ' '),
        email: trimmedEmail,
        role: 'Developer',
      };
    } else {
      throw new Error('Password must be at least 6 characters (or use password123).');
    }

    setUser(loggedInUser);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  const register = async (name, email, password) => {
    if (!name || !email || !password) {
      throw new Error('All fields are required.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const trimmedEmail = email.trim().toLowerCase();

    let registeredUsers = [];
    try {
      const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (stored) registeredUsers = JSON.parse(stored);
    } catch (e) {}

    const exists = registeredUsers.some((u) => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: trimmedEmail,
      role: 'App Member',
      password,
    };

    registeredUsers.push(newUser);
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));

    const { password: _, ...userSession } = newUser;
    setUser(userSession);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));
    return userSession;
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear auth session', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
