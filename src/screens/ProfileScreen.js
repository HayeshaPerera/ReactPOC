import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useTasks } from '../context/TaskContext';
import { ENV } from '../config/env';

export default function ProfileScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, updateUser, resetUser } = useUser();
  const { completedCount, totalCount } = useTasks();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);

  const handleSaveProfile = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Name cannot be empty.');
      return;
    }
    updateUser({ name, role, email, bio });
    setEditModalVisible(false);
    Alert.alert('Success', 'Profile saved to local storage!');
  };

  const handleToggleNotifications = (val) => {
    updateUser({ notificationsEnabled: val });
  };

  const handleResetProfile = () => {
    Alert.alert('Reset Profile', 'Reset user profile back to defaults?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          resetUser();
          setName('Hayesha Perera');
          setRole('Full Stack Developer');
          setEmail('hayesha@example.com');
          setBio('Building modern mobile apps with React Native & Expo.');
        },
      },
    ]);
  };

  const stats = [
    { label: 'Completed', value: completedCount.toString(), icon: 'checkmark-done' },
    { label: 'Total Tasks', value: totalCount.toString(), icon: 'list' },
    { label: 'Database', value: 'Local', icon: 'server' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.primary }]}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#FFF" />
          </View>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
      </View>

      {/* Stats Cards */}
      <View style={[styles.statsRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Ionicons name={stat.icon} size={22} color={theme.primary} />
            <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance & Preferences</Text>

        <View style={[styles.cardItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardItemLeft}>
            <Ionicons name="moon-outline" size={22} color={theme.primary} />
            <Text style={[styles.cardLabel, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={isDarkMode ? theme.primary : '#FFF'}
          />
        </View>

        <View style={[styles.cardItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardItemLeft}>
            <Ionicons name="notifications-outline" size={22} color={theme.warning} />
            <Text style={[styles.cardLabel, { color: theme.text }]}>Notifications</Text>
          </View>
          <Switch
            value={user.notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: theme.border, true: theme.primaryLight }}
            thumbColor={user.notificationsEnabled ? theme.primary : '#FFF'}
          />
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Account & Storage</Text>

        <TouchableOpacity
          style={[styles.cardItem, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => {
            setName(user.name);
            setRole(user.role);
            setEmail(user.email);
            setBio(user.bio);
            setEditModalVisible(true);
          }}
        >
          <View style={styles.cardItemLeft}>
            <Ionicons name="create-outline" size={22} color={theme.primary} />
            <Text style={[styles.cardLabel, { color: theme.text }]}>Edit Profile (Persisted)</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.subText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cardItem, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() =>
            Alert.alert(
              'Environment Config',
              `App Name: ${ENV.appName}\nEnvironment: ${ENV.environment}\nAPI URL: ${ENV.apiUrl}\nVersion: ${ENV.version}`
            )
          }
        >
          <View style={styles.cardItemLeft}>
            <Ionicons name="code-slash-outline" size={22} color={theme.success} />
            <Text style={[styles.cardLabel, { color: theme.text }]}>Environment Info (.env)</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.subText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cardItem, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={handleResetProfile}
        >
          <View style={styles.cardItemLeft}>
            <Ionicons name="refresh-outline" size={22} color={theme.danger} />
            <Text style={[styles.cardLabel, { color: theme.danger }]}>Reset Profile Data</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.subText} />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.subText }]}>
          {ENV.appName} • {ENV.environment}
        </Text>
        <Text style={[styles.footerText, { color: theme.subText }]}>
          Expo SDK 58 • React Native 0.88
        </Text>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>

            <Text style={[styles.inputLabel, { color: theme.subText }]}>Name</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.text }]}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.inputLabel, { color: theme.subText }]}>Role</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.text }]}
              value={role}
              onChangeText={setRole}
            />

            <Text style={[styles.inputLabel, { color: theme.subText }]}>Email</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.text }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={[styles.inputLabel, { color: theme.subText }]}>Bio</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.inputBg, color: theme.text, height: 60 }]}
              value={bio}
              onChangeText={setBio}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: theme.border }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={{ color: theme.text, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: theme.primary }]}
                onPress={handleSaveProfile}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 54,
    paddingBottom: 22,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  role: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  email: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  joinDate: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: -18,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  cardItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 11,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  modalInput: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
