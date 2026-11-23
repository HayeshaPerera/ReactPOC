import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TaskContext';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { ENV } from '../config/env';

const { width } = Dimensions.get('window');

const QUOTES = [
  { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: 'Cory House' },
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
];

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { completedCount, pendingCount, starredCount, totalCount } = useTasks();
  const { user: userProfile } = useUser();
  const { user: authUser, logout } = useAuth();

  const currentUserName = authUser?.name || userProfile.name;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out and return to the Login screen?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const currentQuote = QUOTES[quoteIndex];

  const stats = [
    { icon: 'checkmark-circle', label: 'Done', value: completedCount, color: theme.success },
    { icon: 'time', label: 'Pending', value: pendingCount, color: theme.warning },
    { icon: 'star', label: 'Starred', value: starredCount, color: '#E91E63' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            {getGreeting()} 👋
          </Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            {currentUserName} • {ENV.appName}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={42} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerLogoutBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={18} color={theme.danger} />
            <Text style={[styles.headerLogoutText, { color: theme.danger }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Clock Card */}
      <View style={[styles.clockCard, { backgroundColor: theme.primary }]}>
        <Text style={styles.time}>{formatTime()}</Text>
        <Text style={styles.date}>{formatDate()}</Text>
        <View style={styles.envPill}>
          <Text style={styles.envPillText}>ENV: {ENV.environment.toUpperCase()}</Text>
        </View>
      </View>

      {/* Real-time Task Progress Summary */}
      <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
        <View style={styles.summaryHeader}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>Task Progress</Text>
          <Text style={[styles.summaryPercent, { color: theme.primary }]}>
            {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
          </Text>
        </View>
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
        <Text style={[styles.summarySub, { color: theme.subText }]}>
          {completedCount} of {totalCount} total tasks completed
        </Text>
      </View>

      {/* Live Stats Row */}
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <Ionicons name={stat.icon} size={26} color={stat.color} />
            <Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quote Card */}
      <View style={[styles.quoteCard, { backgroundColor: theme.card }]}>
        <View style={styles.quoteTop}>
          <Ionicons name="chatbubble-ellipses" size={22} color={theme.primary} />
          <TouchableOpacity onPress={nextQuote}>
            <Ionicons name="refresh" size={20} color={theme.subText} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.quoteText, { color: theme.text }]}>
          "{currentQuote.text}"
        </Text>
        <Text style={[styles.quoteAuthor, { color: theme.primary }]}>
          — {currentQuote.author}
        </Text>
      </View>

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Tasks')}
        >
          <Ionicons name="add-circle" size={30} color={theme.success} />
          <Text style={[styles.actionText, { color: theme.text }]}>Manage Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={30} color={theme.primary} />
          <Text style={[styles.actionText, { color: theme.text }]}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={nextQuote}
        >
          <Ionicons name="sparkles" size={30} color={theme.warning} />
          <Text style={[styles.actionText, { color: theme.text }]}>Inspire Me</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 54,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  avatarContainer: {
    padding: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  headerLogoutText: {
    fontSize: 12,
    fontWeight: '700',
  },
  clockCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  time: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
  },
  date: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
  },
  envPill: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 10,
  },
  envPillText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  summaryPercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  summarySub: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  statCard: {
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  quoteCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  quoteTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  quoteAuthor: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'right',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionCard: {
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
});
