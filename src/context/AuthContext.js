import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@reactpoc_auth_session';
const USERS_STORAGE_KEY = '@reactpoc_registered_users';

const INITIAL_DEMO_USERS = [
  {
    id: 'usr_demo_1',
    name: 'Hayesha Perera',
    email: 'hayesha@example.com',
    role: 'Full Stack Developer',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initAuthAndUsers();
  }, []);

  const initAuthAndUsers = async () => {
    try {
      // Ensure initial demo user exists in storage
      const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsers) {
        await AsyncStorage.setItem(
          USERS_STORAGE_KEY,
          JSON.stringify(INITIAL_DEMO_USERS)
        );
      }

      // Check for active login session
      const session = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (session) {
        setUser(JSON.parse(session));
      }
    } catch (e) {
      console.warn('Failed to initialize auth', e);
    } finally {
      setIsLoading(false);
    }
  };

  const getRegisteredUsers = async () => {
    try {
      const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading registered users', e);
    }
    return INITIAL_DEMO_USERS;
  };

  const login = async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';

    // 1. Validation checks
    if (!trimmedEmail) {
      throw new Error('Email address is required.');
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address (e.g. name@domain.com).');
    }
    if (!cleanPassword) {
      throw new Error('Password is required.');
    }

    // 2. Fetch users database
    const users = await getRegisteredUsers();

    // 3. Find user by email
    const matchedUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!matchedUser) {
      throw new Error('No account found with this email. Please create an account first.');
    }

    // 4. Verify password strictly
    if (matchedUser.password !== cleanPassword) {
      throw new Error('Incorrect password. Please try again.');
    }

    // 5. Successful login
    const { password: _, ...userSession } = matchedUser;
    setUser(userSession);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userSession));
    return userSession;
  };

  const register = async (name, email, password, confirmPassword) => {
    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';
    const cleanConfirm = confirmPassword || '';

    // 1. Name validation
    if (!trimmedName || trimmedName.length < 2) {
      throw new Error('Please enter your full name (at least 2 characters).');
    }

    // 2. Email validation
    if (!trimmedEmail) {
      throw new Error('Email address is required.');
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address (e.g. name@domain.com).');
    }

    // 3. Password validations
    if (!cleanPassword) {
      throw new Error('Password is required.');
    }
    if (cleanPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (cleanConfirm && cleanPassword !== cleanConfirm) {
      throw new Error('Passwords do not match. Please re-type your password.');
    }

    // 4. Duplicate email validation
    const users = await getRegisteredUsers();
    const alreadyExists = users.some(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (alreadyExists) {
      throw new Error(
        'An account with this email already exists. Please sign in instead.'
      );
    }

    // 5. Create and persist new user
    const newUser = {
      id: 'usr_' + Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      role: 'Member',
      password: cleanPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // 6. Automatically log in newly registered user
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
