import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const userInfo = {
    name: 'Hayesha Perera',
    email: 'hayesha@example.com',
    role: 'Full Stack Developer',
    joinDate: 'November 2026',
  };

  const stats = [
    { label: 'Tasks Done', value: '127', icon: 'checkmark-done' },
    { label: 'Streak', value: '14 days', icon: 'flame' },
    { label: 'Level', value: 'Pro', icon: 'trophy' },
  ];

  const menuItems = [
    {
      icon: 'person-outline',
      label: 'Edit Profile',
      color: '#6C63FF',
      onPress: () => Alert.alert('Edit Profile', 'Profile editing coming soon!'),
    },
    {
      icon: 'settings-outline',
      label: 'Settings',
      color: '#FF9800',
      onPress: () => Alert.alert('Settings', 'Settings page coming soon!'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & Support',
      color: '#4CAF50',
      onPress: () => Alert.alert('Help', 'Contact us at support@reactpoc.com'),
    },
    {
      icon: 'information-circle-outline',
      label: 'About',
      color: '#2196F3',
      onPress: () =>
        Alert.alert(
          'ReactPOC',
          'Version 1.0.0\nBuilt with React Native & Expo\n\nA simple proof of concept app.'
        ),
    },
    {
      icon: 'log-out-outline',
      label: 'Log Out',
      color: '#FF5252',
      onPress: () =>
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log Out', style: 'destructive', onPress: () => Alert.alert('Logged out!') },
        ]),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#FFF" />
          </View>
        </View>
        <Text style={styles.name}>{userInfo.name}</Text>
        <Text style={styles.role}>{userInfo.role}</Text>
        <Text style={styles.email}>{userInfo.email}</Text>
        <Text style={styles.joinDate}>Member since {userInfo.joinDate}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Ionicons name={stat.icon} size={24} color="#6C63FF" />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceItem}>
          <View style={styles.prefLeft}>
            <Ionicons name="moon-outline" size={22} color="#6C63FF" />
            <Text style={styles.prefLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#E0E0E0', true: '#B8B4FF' }}
            thumbColor={darkMode ? '#6C63FF' : '#FFF'}
          />
        </View>
        <View style={styles.preferenceItem}>
          <View style={styles.prefLeft}>
            <Ionicons name="notifications-outline" size={22} color="#FF9800" />
            <Text style={styles.prefLabel}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#E0E0E0', true: '#FFD699' }}
            thumbColor={notifications ? '#FF9800' : '#FFF'}
          />
        </View>
      </View>

      {/* Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={[styles.menuLabel, item.label === 'Log Out' && { color: '#FF5252' }]}>
              {item.label}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>ReactPOC v1.0.0</Text>
        <Text style={styles.footerText}>Built with ❤️ using React Native & Expo</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#6C63FF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  role: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  joinDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prefLabel: {
    fontSize: 16,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#BBB',
    marginTop: 4,
  },
});
