import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const PROFILE_PIC = require('../assets/naomiformalpic.jpg');

const ChatBoxScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = () => {
    if (message.trim() !== '') {
      setIsSending(true);
      setTimeout(() => {
        setChat([...chat, message.trim()]);
        setMessage('');
        setIsSending(false);
      }, 500);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.screenTitle}>Chat Box 💬</Text>

      <ScrollView
        style={styles.commentList}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {chat.map((item, index) => (
          <View key={index} style={styles.chatItem}>
            <Image source={PROFILE_PIC} style={styles.commentProfilePic} />
            <View style={styles.chatBubble}>
              <Text style={styles.commentText}>{item}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.textArea}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          editable={!isSending}
        />
        <TouchableOpacity
          style={[
            styles.postButton,
            message.trim() === '' || isSending
              ? styles.disabledButton
              : styles.activeButton,
          ]}
          onPress={sendMessage}
          disabled={message.trim() === '' || isSending}
        >
          <Text style={styles.postButtonText}>
            {isSending ? 'Sending...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default ChatBoxScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff0f5',
    padding: 20,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
  },
  commentProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFC0CB',
    marginRight: 8,
  },
  chatItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chatBubble: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: '#ffd1dc',
  },
  commentText: {
    fontSize: 15,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  textArea: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    minHeight: 40,
  },
  postButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#007BFF',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
});
