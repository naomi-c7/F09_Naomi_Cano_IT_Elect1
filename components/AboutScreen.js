// components/AboutScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PROFILE_PIC = require('../assets/naomiformalpic.jpg');

export default function AboutScreen() {
  return (
    <LinearGradient
      colors={['#E0C3FC', '#FFB6E1', '#FEC4D9']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Image source={PROFILE_PIC} style={styles.profileImage} />
          
          <Text style={styles.name}>Naomi C. Caño 🌸</Text>
          
          <View style={styles.infoSection}>
            <Text style={styles.label}>Submitted by:</Text>
            <Text style={styles.value}>Naomi C. Caño</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Submitted To:</Text>
            <Text style={styles.value}>Jay Ian Camelotes</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Bio:</Text>
            <Text style={styles.value}>
              Coffee-powered student trying to survive college ☕🌸💻{'\n\n'}
              Always doing my best and trusting God's plans in every step.{'\n\n'}
              Do not be afraid or discouraged, for the Lord your God is with you wherever you go. — Joshua 1:9
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>Tapon, Ubay, Bohol</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Course:</Text>
            <Text style={styles.value}>BSIT-3</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Subject:</Text>
            <Text style={styles.value}>IT ELECT1</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Features:</Text>
            <Text style={styles.value}>
              • Beautiful gradient UI design with pink-purple theme{'\n'}
              • User authentication (Signup/Login){'\n'}
              • Password reset functionality{'\n'}
              • Social media news feed{'\n'}
              • Create posts with photos and captions{'\n'}
              • Like posts system{'\n'}
              • Comment on posts with profile pictures{'\n'}
              • Real-time private messaging between users{'\n'}
              • Profile customization with photo upload{'\n'}
              • SQLite database for data persistence{'\n'}
              • Image picker for profile pictures and posts{'\n'}
              • Bottom navigation with aesthetic icons{'\n'}
              • Persistent data storage (comments, messages, posts)
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#C49FF0',
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  infoSection: {
    width: '100%',
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C49FF0',
    marginBottom: 5,
  },
  value: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});