import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation, route }) => {
  const username = route.params?.username;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {username} 🌸</Text>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('CommentBox')}
      >
        <Text style={styles.navButtonText}>Go to Comment Box</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('ChatBox', { username })}
      >
        <Text style={styles.navButtonText}>Go to Chat Box</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe6f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  navButton: {
    width: '80%',
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 20,
    width: '50%',
    backgroundColor: '#FF4D4D',
    paddingVertical: 10,
    borderRadius: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
