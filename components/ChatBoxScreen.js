// components/ChatBoxScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

export default function ChatBoxScreen({ navigation, route }) {
  const db = useSQLiteContext();

  // ✅ FIX: currentUser is a string, not an object
  const currentUser = route.params?.username || 'User';

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const results = await db.getAllAsync(
          'SELECT username FROM users WHERE username != ?',
          [currentUser]
        );
        setUsers(results);
      } catch (err) {
        console.error(err);
      }
    };
    loadUsers();
  }, [currentUser]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#ffe6f0', padding: 10 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Select a user to chat with:</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() =>
              navigation.navigate('PrivateChat', {
                // ✅ FIX: pass correct currentUser and otherUser
                currentUser: currentUser,
                otherUser: item.username,
              })
            }
          >
            <Text style={styles.usernameText}>{item.username}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No other users found</Text>}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  userItem: { padding: 12, backgroundColor: '#fff', marginBottom: 8, borderRadius: 10 },
  usernameText: { fontSize: 16, color: '#333' },
  emptyText: { fontSize: 16, textAlign: 'center', marginTop: 20 },
});
