import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@reactpoc_user';

const DEFAULT_USER = {
  name: 'Hayesha Perera',
  email: 'hayesha@example.com',
  role: 'Full Stack Developer',
  bio: 'Building modern mobile apps with React Native & Expo.',
  notificationsEnabled: true,
  joinDate: 'November 2026',
};

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const saved = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (saved !== null) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load user profile', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const updateUser = async (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    setUser(newUser);
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } catch (e) {
      console.warn('Failed to save user profile', e);
    }
  };

  const resetUser = async () => {
    setUser(DEFAULT_USER);
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to reset user profile', e);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, resetUser, isLoaded }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
