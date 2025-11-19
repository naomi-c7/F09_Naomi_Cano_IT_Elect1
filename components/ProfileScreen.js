// components/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';

export default function ProfileScreen({ route, navigation }) {
  const db = useSQLiteContext();
  const { userId } = route.params || {};
  
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const users = await db.getAllAsync(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );
      if (users.length > 0) {
        setUser(users[0]);
        setProfileImage(users[0].profilePicture);
      }
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setTempImage(result.assets[0].uri);
    }
  };

  const updateProfilePicture = async () => {
    if (!tempImage) {
      Alert.alert('No image selected', 'Please select an image first');
      return;
    }
    
    try {
      await db.runAsync(
        'UPDATE users SET profilePicture = ? WHERE id = ?',
        [tempImage, userId]
      );
      setProfileImage(tempImage);
      setTempImage(null);
      Alert.alert('Success! 🎉', 'Profile picture updated!');
    } catch (err) {
      console.error('Error updating profile picture:', err);
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.replace('Welcome') }
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const displayImage = tempImage || profileImage;

  return (
    <LinearGradient
      colors={['#E0C3FC', '#FFB6E1', '#FEC4D9']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {displayImage ? (
              <Image source={{ uri: displayImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </TouchableOpacity>

          {tempImage && (
            <TouchableOpacity onPress={updateProfilePicture} style={styles.updateButtonContainer}>
              <LinearGradient
                colors={['#FFB6E1', '#C49FF0']}
                style={styles.updateButton}
              >
                <Text style={styles.updateButtonText}>✓ Update Picture</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userBirthday}>🎂 {user.birthday}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogout}>
            <LinearGradient
              colors={['#FFB6E1', '#C49FF0']}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#C49FF0',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#C49FF0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFB6E1',
  },
  profileImageText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#C49FF0',
  },
  cameraIcon: {
    fontSize: 20,
  },
  updateButtonContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  updateButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  userBirthday: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
  logoutButton: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});