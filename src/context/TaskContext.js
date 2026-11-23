import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY = '@reactpoc_tasks';

const INITIAL_TASKS = [
  { id: '1', text: 'Explore React Native components', completed: true, category: 'work', starred: true },
  { id: '2', text: 'Test offline storage with AsyncStorage', completed: true, category: 'work', starred: false },
  { id: '3', text: 'Buy groceries & coffee', completed: false, category: 'shopping', starred: false },
  { id: '4', text: 'Morning 5km workout', completed: false, category: 'personal', starred: true },
  { id: '5', text: 'Review project requirements & specs', completed: false, category: 'work', starred: false },
];

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load tasks from local storage', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const persistTasks = async (newTasks) => {
    setTasks(newTasks);
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newTasks));
    } catch (e) {
      console.warn('Failed to save tasks to local storage', e);
    }
  };

  const addTask = (text, category = 'work') => {
    const newTask = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      category,
      starred: false,
      createdAt: new Date().toISOString(),
    };
    persistTasks([newTask, ...tasks]);
  };

  const toggleTask = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    persistTasks(updated);
  };

  const toggleStar = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, starred: !t.starred } : t
    );
    persistTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    persistTasks(updated);
  };

  const clearAllTasks = () => {
    persistTasks([]);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const starredCount = tasks.filter((t) => t.starred).length;
  const totalCount = tasks.length;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoaded,
        addTask,
        toggleTask,
        toggleStar,
        deleteTask,
        clearAllTasks,
        completedCount,
        pendingCount,
        starredCount,
        totalCount,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
