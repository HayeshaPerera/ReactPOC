import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@reactpoc_theme';

export const lightTheme = {
  dark: false,
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#1A1A2E',
  subText: '#666666',
  border: '#E8E8E8',
  primary: '#6C63FF',
  primaryLight: '#E8E6FF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#FF5252',
  inputBg: '#F5F5F5',
  tabBar: '#FFFFFF',
  statusBarStyle: 'dark',
};

export const darkTheme = {
  dark: true,
  background: '#121218',
  card: '#1E1E2A',
  text: '#F5F5FA',
  subText: '#A0A0B0',
  border: '#2C2C3A',
  primary: '#7C74FF',
  primaryLight: '#2D2B52',
  success: '#66BB6A',
  warning: '#FFA726',
  danger: '#FF6B6B',
  inputBg: '#282838',
  tabBar: '#1A1A24',
  statusBarStyle: 'light',
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (e) {
      console.warn('Failed to load theme preference', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async (value) => {
    const nextVal = typeof value === 'boolean' ? value : !isDarkMode;
    setIsDarkMode(nextVal);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextVal ? 'dark' : 'light');
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
