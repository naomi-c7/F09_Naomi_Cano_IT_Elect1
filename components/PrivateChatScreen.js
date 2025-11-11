// components/PrivateChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

const PROFILE_PIC = require('../assets/naomiformalpic.jpg');

export default function PrivateChatScreen({ route }) {
  const { currentUser, otherUser } = route.params;
  const db = useSQLiteContext();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef();

  // ✅ Load messages between currentUser and otherUser
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const results = await db.getAllAsync(
          `SELECT * FROM messages
           WHERE (sender = ? AND receiver = ?)
           OR (sender = ? AND receiver = ?)
           ORDER BY timestamp ASC`,
          [currentUser, otherUser, otherUser, currentUser]
        );

        setMessages(results);
      } catch (err) {
        console.error('loadMessages error', err);
      }
    };

    loadMessages();
  }, [currentUser, otherUser]);

  // ✅ Send message and save it in DB
  const sendMessage = async () => {
    if (message.trim() === '') return;

    const newMessage = {
      sender: currentUser,
      receiver: otherUser,
      message: message.trim(),
      timestamp: Date.now(),
    };

    try {
      await db.runAsync(
        `INSERT INTO messages (sender, receiver, message, timestamp) VALUES (?, ?, ?, ?)`,
        [newMessage.sender, newMessage.receiver, newMessage.message, newMessage.timestamp]
      );

      setMessages((prev) => [...prev, newMessage]);
      setMessage('');

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error('sendMessage error', err);
    }
  };

  // ✅ Render chat bubbles
  const renderItem = ({ item }) => {
    const isCurrentUser = item.sender === currentUser;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.rightAlign : styles.leftAlign,
        ]}
      >
        {!isCurrentUser && <Image source={PROFILE_PIC} style={styles.profilePic} />}
        <View
          style={[
            styles.bubble,
            isCurrentUser ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
        {isCurrentUser && <Image source={PROFILE_PIC} style={styles.profilePic} />}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff0f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 80}
    >
      <Text style={styles.header}>Chat with {otherUser}</Text>

      <FlatList
        ref={flatListRef}
        style={{ flex: 1, padding: 10 }}
        data={messages}
       keyExtractor={(item, index) => `${item.id}-${item.timestamp}-${index}`}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 10 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, message.trim() === '' && styles.disabledButton]}
          onPress={sendMessage}
          disabled={message.trim() === ''}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  leftAlign: { justifyContent: 'flex-start' },
  rightAlign: { justifyContent: 'flex-end' },
  profilePic: { width: 35, height: 35, borderRadius: 18, marginHorizontal: 5 },
  bubble: {
    padding: 10,
    borderRadius: 15,
    maxWidth: '70%',
  },
  myBubble: {
    backgroundColor: '#007BFF',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderColor: '#ffd1dc',
    borderWidth: 1,
    borderTopLeftRadius: 0,
  },
  messageText: { fontSize: 15, color: '#000' },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff0f5',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 20,
    paddingHorizontal: 15,
    minHeight: 45,
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginLeft: 8,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    height: 45,
  },
  disabledButton: { backgroundColor: '#ccc' },
  sendText: { color: '#fff', fontWeight: 'bold' },
});