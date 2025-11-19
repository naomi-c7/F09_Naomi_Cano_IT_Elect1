// components/SignupScreen.js
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
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SignupScreen({ navigation }) {
  const db = useSQLiteContext();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password);
    const validLength = password.length >= 6 && password.length <= 20;
    return { hasNumber, validLength };
  };

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      return Alert.alert('Error', 'Please fill in all fields');
    }

    const nameParts = fullName.trim().split(' ');
    if (nameParts.length < 2) {
      return Alert.alert('Error', 'Please enter your full name (First and Last name)');
    }

    if (!validateEmail(email)) {
      return Alert.alert('Invalid Email', 'Please enter a valid email address');
    }

    const { hasNumber, validLength } = validatePassword(password);
    if (!validLength) {
      return Alert.alert('Invalid Password', 'Password must be between 6-20 characters long');
    }
    if (!hasNumber) {
      return Alert.alert('Invalid Password', 'Password must contain at least one number');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Password Mismatch', 'Passwords do not match. Please try again.');
    }

    try {
      const existingUser = await db.getAllAsync(
        'SELECT * FROM users WHERE email = ?',
        [email.toLowerCase()]
      );

      if (existingUser.length > 0) {
        return Alert.alert('Error', 'This email is already registered!');
      }

      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      await db.runAsync(
        `INSERT INTO users (firstName, lastName, email, password, birthday, profilePicture) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, email.toLowerCase(), password, formatDate(birthday), '']
      );

      Alert.alert('Success', 'Account created successfully! 🎉', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(err);
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
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>We're here to help you reach the peaks</Text>
            <Text style={styles.subtitle}>of learning. Are you ready?</Text>

            <TextInput
              placeholder="Enter full name"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {birthday ? formatDate(birthday) : 'Select Birthday'}
              </Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthday}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            <TextInput
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#999"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Confirm password"
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

            <TouchableOpacity onPress={handleSignup}>
              <LinearGradient
                colors={['#FFB6E1', '#C49FF0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signupButton}
              >
                <Text style={styles.signupButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 60,
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
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 3,
  },
  input: {
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginTop: 15,
    backgroundColor: '#F8F8F8',
    fontSize: 15,
  },
  dateButton: {
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginTop: 15,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    color: '#333',
  },
  calendarIcon: {
    fontSize: 20,
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
  signupButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#C49FF0',
    fontWeight: 'bold',
  },
});