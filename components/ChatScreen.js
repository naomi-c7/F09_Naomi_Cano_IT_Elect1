// components/ChatScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSQLiteContext } from 'expo-sqlite';

export default function ChatScreen({ route }) {
  const db = useSQLiteContext();
  const { userId, otherUserId, userName } = route.params;
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const flatListRef = useRef();

  useEffect(() => {
    loadUserData();
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadUserData = async () => {
    try {
      const [current] = await db.getAllAsync('SELECT * FROM users WHERE id = ?', [userId]);
      const [other] = await db.getAllAsync('SELECT * FROM users WHERE id = ?', [otherUserId]);
      setCurrentUser(current);
      setOtherUser(other);
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const loadMessages = async () => {
    try {
      const msgs = await db.getAllAsync(
        `SELECT * FROM messages 
         WHERE (senderId = ? AND receiverId = ?) 
         OR (senderId = ? AND receiverId = ?)
         ORDER BY createdAt ASC`,
        [userId, otherUserId, otherUserId, userId]
      );
      setMessages(msgs);
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;

    try {
      await db.runAsync(
        'INSERT INTO messages (senderId, receiverId, message) VALUES (?, ?, ?)',
        [userId, otherUserId, message.trim()]
      );
      
      setMessage('');
      loadMessages();
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === userId;
    const user = isMyMessage ? currentUser : otherUser;
    
    if (!user) return null;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {!isMyMessage && (
          <View style={styles.avatarContainer}>
            {user.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.chatAvatar} />
            ) : (
              <View style={styles.chatAvatarPlaceholder}>
                <Text style={styles.chatAvatarText}>
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </Text>
              </View>
            )}
          </View>
        )}
        
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myBubble : styles.theirBubble,
          ]}
        >
          <Text style={[
            styles.messageText,
            isMyMessage && styles.myMessageText
          ]}>
            {item.message}
          </Text>
        </View>

        {isMyMessage && (
          <View style={styles.avatarContainer}>
            {user.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.chatAvatar} />
            ) : (
              <View style={[styles.chatAvatarPlaceholder, styles.myAvatarPlaceholder]}>
                <Text style={styles.chatAvatarText}>
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <LinearGradient
        colors={['#E0C3FC', '#FFB6E1', '#FEC4D9']}
        style={styles.container}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={message.trim() === ''}
          >
            <LinearGradient
              colors={message.trim() ? ['#FFB6E1', '#C49FF0'] : ['#ccc', '#ccc']}
              style={styles.sendButton}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  theirMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginHorizontal: 5,
  },
  chatAvatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#C49FF0',
  },
  chatAvatarPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#C49FF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myAvatarPlaceholder: {
    backgroundColor: '#FFB6E1',
  },
  chatAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: '#C49FF0',
    borderTopRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#000',
  },
  myMessageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});