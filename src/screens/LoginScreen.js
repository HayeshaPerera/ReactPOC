import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ENV } from '../config/env';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const { theme } = useTheme();

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const switchTab = (toRegister) => {
    setIsRegistering(toRegister);
    setErrorMessage('');
    setPassword('');
    setConfirmPassword('');
    if (toRegister) {
      setName('');
      setEmail('');
    } else {
      setEmail('');
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setErrorMessage('');

    // Pre-flight checks on client side
    if (isRegistering) {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter a password.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
    } else {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isRegistering) {
        await register(name, email, password, confirmPassword);
      } else {
        await login(email, password);
      }
    } catch (err) {
      const msg = err.message || 'Authentication failed.';
      setErrorMessage(msg);
      Alert.alert('Validation Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async () => {
    setErrorMessage('');
    setEmail('hayesha@example.com');
    setPassword('password123');
    setSubmitting(true);
    try {
      await login('hayesha@example.com', 'password123');
    } catch (err) {
      const msg = err.message || 'Demo login failed.';
      setErrorMessage(msg);
      Alert.alert('Login Failed', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={[styles.logoCircle, { backgroundColor: theme.primary }]}>
            <Ionicons name="flash" size={38} color="#FFF" />
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>{ENV.appName}</Text>
          <Text style={[styles.tagline, { color: theme.subText }]}>
            Proof of Concept • React Native & Expo
          </Text>
        </View>

        {/* Auth Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {/* Tabs: Sign In / Create Account */}
          <View style={[styles.tabBar, { backgroundColor: theme.inputBg }]}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                !isRegistering && [styles.tabBtnActive, { backgroundColor: theme.card }],
              ]}
              onPress={() => switchTab(false)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: !isRegistering ? theme.primary : theme.subText },
                  !isRegistering && { fontWeight: '700' },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                isRegistering && [styles.tabBtnActive, { backgroundColor: theme.card }],
              ]}
              onPress={() => switchTab(true)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isRegistering ? theme.primary : theme.subText },
                  isRegistering && { fontWeight: '700' },
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Inline Error Banner */}
          {errorMessage ? (
            <View style={[styles.errorBanner, { backgroundColor: theme.danger + '18', borderColor: theme.danger }]}>
              <Ionicons name="alert-circle" size={18} color={theme.danger} />
              <Text style={[styles.errorText, { color: theme.danger }]}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* Form Fields */}
          {isRegistering && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>Full Name *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg }]}>
                <Ionicons name="person-outline" size={20} color={theme.subText} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="e.g. Hayesha Perera"
                  placeholderTextColor={theme.subText}
                  value={name}
                  onChangeText={(val) => { setName(val); setErrorMessage(''); }}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.subText }]}>Email Address *</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg }]}>
              <Ionicons name="mail-outline" size={20} color={theme.subText} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="you@example.com"
                placeholderTextColor={theme.subText}
                value={email}
                onChangeText={(val) => { setEmail(val); setErrorMessage(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.subText }]}>
              {isRegistering ? 'Password (min. 6 chars) *' : 'Password *'}
            </Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.subText} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder={isRegistering ? 'At least 6 characters' : 'Enter your password'}
                placeholderTextColor={theme.subText}
                value={password}
                onChangeText={(val) => { setPassword(val); setErrorMessage(''); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.subText}
                />
              </TouchableOpacity>
            </View>
          </View>

          {isRegistering && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.subText }]}>Confirm Password *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.inputBg }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={theme.subText} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Re-enter your password"
                  placeholderTextColor={theme.subText}
                  value={confirmPassword}
                  onChangeText={(val) => { setConfirmPassword(val); setErrorMessage(''); }}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.subText}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitText}>
                {isRegistering ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Quick Demo Login Option */}
          {!isRegistering && (
            <TouchableOpacity
              style={[styles.demoBtn, { borderColor: theme.primaryLight }]}
              onPress={handleQuickDemo}
              disabled={submitting}
            >
              <Ionicons name="log-in-outline" size={18} color={theme.primary} />
              <Text style={[styles.demoBtnText, { color: theme.primary }]}>
                1-Tap Demo Login (hayesha@example.com)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.subText }]}>
            Strict Account & Password Validation Enabled
          </Text>
          <Text style={[styles.footerText, { color: theme.subText }]}>
            Demo: hayesha@example.com • password123
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  submitText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 11,
    marginTop: 12,
    gap: 8,
  },
  demoBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 11,
    marginTop: 2,
  },
});
