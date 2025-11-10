import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const PROFILE_PIC = require('../assets/naomiformalpic.jpg');

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.homeContainer}>
      <Image source={PROFILE_PIC} style={styles.homeProfilePic} />
      <Text style={styles.homeTitle}>Welcome, Naomi 🌸</Text>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('CommentBox')}
      >
        <Text style={styles.homeButtonText}>Go to Comment Box</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('ChatBox')}
      >
        <Text style={styles.homeButtonText}>Go to Chat Box</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: '#ffe6f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  homeProfilePic: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 15,
  },
  homeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 15,
    width: '80%',
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
