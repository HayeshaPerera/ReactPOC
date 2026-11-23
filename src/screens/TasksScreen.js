import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'list' },
  { id: 'work', label: 'Work', icon: 'briefcase' },
  { id: 'personal', label: 'Personal', icon: 'person' },
  { id: 'shopping', label: 'Shopping', icon: 'cart' },
];

export default function TasksScreen() {
  const { theme } = useTheme();
  const {
    tasks,
    addTask,
    toggleTask,
    toggleStar,
    deleteTask,
    clearAllTasks,
    completedCount,
    totalCount,
  } = useTasks();

  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [taskCategory, setTaskCategory] = useState('work');

  const handleAddTask = () => {
    if (newTask.trim() === '') {
      Alert.alert('Required', 'Please enter a task description.');
      return;
    }
    addTask(newTask, taskCategory);
    setNewTask('');
  };

  const confirmDelete = (id) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(id) },
    ]);
  };

  const confirmClearAll = () => {
    if (tasks.length === 0) return;
    Alert.alert('Clear All Tasks', 'Are you sure you want to remove all tasks?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearAllTasks },
    ]);
  };

  const filteredTasks =
    selectedCategory === 'all'
      ? tasks
      : tasks.filter((t) => t.category === selectedCategory);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'work': return theme.primary;
      case 'personal': return theme.success;
      case 'shopping': return theme.warning;
      default: return theme.subText;
    }
  };

  const renderTask = ({ item }) => (
    <View
      style={[
        styles.taskItem,
        { backgroundColor: theme.card, borderColor: theme.border },
        item.completed && styles.taskCompleted,
      ]}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTask(item.id)}
      >
        <Ionicons
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={item.completed ? theme.success : theme.subText}
        />
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskText,
            { color: theme.text },
            item.completed && [styles.taskTextCompleted, { color: theme.subText }],
          ]}
        >
          {item.text}
        </Text>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(item.category) + '22' },
            ]}
          >
            <Text
              style={[
                styles.categoryBadgeText,
                { color: getCategoryColor(item.category) },
              ]}
            >
              {item.category}
            </Text>
          </View>
          <Text style={[styles.savedBadge, { color: theme.subText }]}>
            • saved offline
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => toggleStar(item.id)}
        style={styles.iconBtn}
      >
        <Ionicons
          name={item.starred ? 'star' : 'star-outline'}
          size={20}
          color={item.starred ? '#FFB300' : theme.subText}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => confirmDelete(item.id)}
        style={styles.iconBtn}
      >
        <Ionicons name="trash-outline" size={20} color={theme.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>My Tasks</Text>
          <Text style={[styles.progress, { color: theme.primary }]}>
            {completedCount}/{totalCount} completed • Local Database
          </Text>
        </View>
        <TouchableOpacity onPress={confirmClearAll} style={styles.clearBtn}>
          <Ionicons name="trash" size={18} color={theme.subText} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
        <View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: theme.primary,
              width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%',
            },
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
              { backgroundColor: theme.card, borderColor: theme.border },
              selectedCategory === cat.id && { backgroundColor: theme.primary, borderColor: theme.primary },
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon}
              size={15}
              color={selectedCategory === cat.id ? '#FFF' : theme.subText}
            />
            <Text
              style={[
                styles.categoryChipText,
                { color: theme.subText },
                selectedCategory === cat.id && { color: '#FFF', fontWeight: 'bold' },
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
            <Ionicons name="checkmark-done-circle" size={54} color={theme.subText} />
            <Text style={[styles.emptyText, { color: theme.text }]}>All clear!</Text>
            <Text style={[styles.emptySubtext, { color: theme.subText }]}>
              Add a new task below. It persists in local storage.
            </Text>
          </View>
        }
      />

      {/* Add Task Input Area */}
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.card, borderTopColor: theme.border },
        ]}
      >
        <View style={styles.categorySelector}>
          {['work', 'personal', 'shopping'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.miniCategoryChip,
                { backgroundColor: theme.inputBg },
                taskCategory === cat && { backgroundColor: getCategoryColor(cat) },
              ]}
              onPress={() => setTaskCategory(cat)}
            >
              <Text
                style={[
                  styles.miniCategoryText,
                  { color: theme.subText },
                  taskCategory === cat && { color: '#FFF', fontWeight: '700' },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text }]}
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Add a new task (persisted to storage)..."
            placeholderTextColor={theme.subText}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={handleAddTask}
          >
            <Ionicons name="add" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  progress: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  clearBtn: {
    padding: 8,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 20,
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
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
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  taskCompleted: {
    opacity: 0.65,
  },
  checkbox: {
    marginRight: 10,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 15,
    fontWeight: '500',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  savedBadge: {
    fontSize: 10,
  },
  iconBtn: {
    padding: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  miniCategoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  miniCategoryText: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginRight: 8,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
