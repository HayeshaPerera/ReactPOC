import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'list' },
  { id: 'work', label: 'Work', icon: 'briefcase' },
  { id: 'personal', label: 'Personal', icon: 'person' },
  { id: 'shopping', label: 'Shopping', icon: 'cart' },
];

const INITIAL_TASKS = [
  { id: '1', text: 'Set up React Native project', completed: true, category: 'work' },
  { id: '2', text: 'Design app UI mockups', completed: false, category: 'work' },
  { id: '3', text: 'Buy groceries', completed: false, category: 'shopping' },
  { id: '4', text: 'Go for a run', completed: false, category: 'personal' },
  { id: '5', text: 'Read documentation', completed: true, category: 'work' },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [taskCategory, setTaskCategory] = useState('work');

  const addTask = () => {
    if (newTask.trim() === '') {
      Alert.alert('Oops!', 'Please enter a task description.');
      return;
    }
    const task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      category: taskCategory,
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setTasks(tasks.filter((task) => task.id !== id)),
      },
    ]);
  };

  const filteredTasks =
    selectedCategory === 'all'
      ? tasks
      : tasks.filter((task) => task.category === selectedCategory);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return '#6C63FF';
      case 'personal': return '#4CAF50';
      case 'shopping': return '#FF9800';
      default: return '#888';
    }
  };

  const renderTask = ({ item }) => (
    <View style={[styles.taskItem, item.completed && styles.taskCompleted]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTask(item.id)}
      >
        <Ionicons
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={item.completed ? '#4CAF50' : '#CCC'}
        />
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
          {item.text}
        </Text>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
          <Text style={[styles.categoryBadgeText, { color: getCategoryColor(item.category) }]}>
            {item.category}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color="#FF5252" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.progress}>
          {completedCount}/{totalCount} completed
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' },
          ]}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              selectedCategory === cat.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon}
              size={16}
              color={selectedCategory === cat.id ? '#FFF' : '#666'}
            />
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === cat.id && styles.categoryChipTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle" size={64} color="#DDD" />
            <Text style={styles.emptyText}>No tasks here!</Text>
            <Text style={styles.emptySubtext}>Add a task below to get started</Text>
          </View>
        }
      />

      {/* Add Task Input */}
      <View style={styles.inputContainer}>
        <View style={styles.categorySelector}>
          {['work', 'personal', 'shopping'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.miniCategoryChip,
                taskCategory === cat && { backgroundColor: getCategoryColor(cat) },
              ]}
              onPress={() => setTaskCategory(cat)}
            >
              <Text
                style={[
                  styles.miniCategoryText,
                  taskCategory === cat && { color: '#FFF' },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Add a new task..."
            placeholderTextColor="#999"
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A2E',
  },
  progress: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#6C63FF',
    borderRadius: 3,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: '#6C63FF',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  taskCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  deleteBtn: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    marginTop: 4,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  miniCategoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  miniCategoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textTransform: 'capitalize',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#6C63FF',
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
