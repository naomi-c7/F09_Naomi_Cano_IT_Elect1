// components/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSQLiteContext } from 'expo-sqlite';

export default function ForgotPasswordScreen({ navigation }) {
  const db = useSQLiteContext();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: enter email, 2: reset password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password);
    const validLength = password.length >= 6 && password.length <= 20;
    return { hasNumber, validLength };
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      return Alert.alert('Error', 'Please enter your email');
    }

    try {
      const users = await db.getAllAsync(
        'SELECT * FROM users WHERE email = ?',
        [email.toLowerCase()]
      );

      if (users.length === 0) {
        return Alert.alert('Error', 'No account found with this email');
      }

      setStep(2);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      return Alert.alert('Error', 'Please fill in both password fields');
    }

    const { hasNumber, validLength } = validatePassword(newPassword);
    if (!validLength) {
      return Alert.alert('Invalid Password', 'Password must be between 6-20 characters long');
    }
    if (!hasNumber) {
      return Alert.alert('Invalid Password', 'Password must contain at least one number');
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    try {
      await db.runAsync(
        'UPDATE users SET password = ? WHERE email = ?',
        [newPassword, email.toLowerCase()]
      );

      Alert.alert('Success', 'Password reset successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to reset password');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#E0C3FC', '#FFB6E1', '#FEC4D9']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            {step === 1 ? (
              <>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>Don't worry! Enter your email and</Text>
                <Text style={styles.subtitle}>we'll help you reset your password.</Text>

                <TextInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  placeholderTextColor="#999"
                />

                <TouchableOpacity onPress={handleEmailSubmit}>
                  <LinearGradient
                    colors={['#FFB6E1', '#C49FF0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Continue</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>Enter your new password</Text>

                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="New password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    style={styles.passwordInput}
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeText}>{showNewPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    style={styles.passwordInput}
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    <Text style={styles.eyeText}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.requirementsBox}>
                  <Text style={styles.requirementsText}>• 6-20 characters long</Text>
                  <Text style={styles.requirementsText}>• Must contain at least one number</Text>
                </View>

                <TouchableOpacity onPress={handlePasswordReset}>
                  <LinearGradient
                    colors={['#FFB6E1', '#C49FF0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Reset Password</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginTop: 25,
    backgroundColor: '#F8F8F8',
    fontSize: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    marginTop: 15,
    backgroundColor: '#F8F8F8',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 20,
    fontSize: 15,
  },
  eyeButton: {
    padding: 10,
    paddingRight: 15,
  },
  eyeText: {
    fontSize: 20,
  },
  requirementsBox: {
    backgroundColor: '#F0E6FF',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  requirementsText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#C49FF0',
    fontWeight: 'bold',
  },
});