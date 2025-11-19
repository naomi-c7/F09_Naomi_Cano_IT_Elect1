// components/WelcomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#E0C3FC', '#FFB6E1', '#FEC4D9']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        {/* Welcome Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Momento ✨</Text>
          <Text style={styles.welcomeTagline}>Where moments become memories.</Text>
        </View>

        {/* Illustration Placeholder - You can add an image here */}
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustrationEmoji}>🌸</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <Text style={styles.signupPrompt}>No account? Create one below!</Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.aboutLink}
            onPress={() => navigation.navigate('About')}
          >
            <Text style={styles.aboutLinkText}>ℹ️ About the Creator</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  welcomeTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 120,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  signupPrompt: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 5,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  aboutLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  aboutLinkText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});