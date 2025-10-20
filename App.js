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

const PROFILE_PIC = require('./assets/naomiformalpic.jpg');
const MOCK_IMAGE = require('./assets/naomisings.jpg');

// --- HomeScreen ---
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

// --- CommentBoxScreen ---
const CommentBoxScreen = ({ navigation }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  const postComment = () => {
    if (comment.trim() !== '') {
      setIsPosting(true);
      const newComment = {
        text: comment.trim(),
        timestamp: Date.now(),
      };

      setTimeout(() => {
        setComments([newComment, ...comments]);
        setComment('');
        setIsPosting(false);
      }, 500);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.commentList}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.screenTitle}>Comment Box 🗨️</Text>

        {/* Facebook-style post box */}
        <View style={styles.postBox}>
          <View style={styles.postHeader}>
            <Image source={PROFILE_PIC} style={styles.commentProfilePic} />
            <Text style={styles.postUser}>Naomi 🌸</Text>
          </View>

          {/* Posted image */}
          <Image source={MOCK_IMAGE} style={styles.postImage} />

          <Text style={styles.postCaption}>🎤 Naomi shared a moment!</Text>

          {/* Comments under the post */}
          <View style={styles.commentSection}>
            {comments.map((item) => (
              <View key={item.timestamp} style={styles.commentItem}>
                <Image source={PROFILE_PIC} style={styles.commentProfilePicSmall} />
                <View style={styles.commentBubble}>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              </View>
            ))}

            {/* Comment input inside post */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textArea}
                placeholder="Write a comment..."
                value={comment}
                onChangeText={setComment}
                editable={!isPosting}
                multiline
              />
            </View>

            <TouchableOpacity
              style={[
                styles.postButton,
                comment.trim() === '' || isPosting
                  ? styles.disabledButton
                  : styles.activeButton,
              ]}
              onPress={postComment}
              disabled={comment.trim() === '' || isPosting}
            >
              <Text style={styles.postButtonText}>
                {isPosting ? 'Posting...' : 'Post Comment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// --- ChatBoxScreen ---
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

// --- Simple Router ---
const Router = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const navigation = { navigate: setCurrentScreen };

  switch (currentScreen) {
    case 'CommentBox':
      return <CommentBoxScreen navigation={navigation} />;
    case 'ChatBox':
      return <ChatBoxScreen navigation={navigation} />;
    default:
      return <HomeScreen navigation={navigation} />;
  }
};

export default function App() {
  return <Router />;
}

// --- Styles ---
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
  postBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ffd1dc',
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postUser: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 8,
  },
  postCaption: {
    fontSize: 15,
    marginBottom: 10,
    color: '#444',
  },
  commentSection: {
    borderTopWidth: 1,
    borderTopColor: '#ffd1dc',
    paddingTop: 10,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  commentProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFC0CB',
    marginRight: 8,
  },
  commentProfilePicSmall: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFC0CB',
    marginRight: 8,
  },
  commentBubble: {
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
    maxHeight: 100,
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
