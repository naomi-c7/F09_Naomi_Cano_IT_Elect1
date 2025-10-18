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

// Use your own images from assets
const PROFILE_PIC = require('./assets/naomiformalpic.jpg');
const MOCK_IMAGE = require('./assets/naomisings.jpg');

// --- 1. HomeScreen ---
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

// --- 2. CommentBoxScreen ---
const CommentBoxScreen = ({ navigation }) => {
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  const handleSelectImage = () => {
    setSelectedImage(selectedImage ? null : MOCK_IMAGE);
  };

  const postComment = () => {
    if (comment.trim() !== '' || selectedImage) {
      setIsPosting(true);
      const newComment = {
        text: comment.trim(),
        image: selectedImage,
        timestamp: Date.now(),
      };

      setTimeout(() => {
        setComments([newComment, ...comments]);
        setComment('');
        setSelectedImage(null);
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

        {comments.map((item) => (
          <View key={item.timestamp} style={styles.commentItem}>
            <Image source={PROFILE_PIC} style={styles.commentProfilePic} />
            <View style={styles.commentBubble}>
              {item.image && <Image source={item.image} style={styles.commentImage} />}
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {selectedImage && (
        <View style={styles.imagePreview}>
          <Image source={selectedImage} style={styles.previewImg} />
          <Text style={styles.imageSelectedText}>Image Selected</Text>
        </View>
      )}

      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[
            styles.selectPicButton,
            { backgroundColor: selectedImage ? '#dc3545' : '#28a745' },
          ]}
          onPress={handleSelectImage}
          disabled={isPosting}
        >
          <Text style={styles.selectPicText}>
            {selectedImage ? 'Remove Pic' : 'Select Pic'}
          </Text>
        </TouchableOpacity>

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
          (comment.trim() === '' && !selectedImage) || isPosting
            ? styles.disabledButton
            : styles.activeButton,
        ]}
        onPress={postComment}
        disabled={(comment.trim() === '' && !selectedImage) || isPosting}
      >
        <Text style={styles.postButtonText}>
          {isPosting ? 'Posting...' : 'Post'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// --- 3. ChatBoxScreen ---
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
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
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
  commentList: {
    flex: 1,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  chatItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  commentProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFC0CB',
    marginRight: 8,
  },
  commentBubble: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: '#ffd1dc',
  },
  chatBubble: {
    backgroundColor: '#e0f0ff',
    borderRadius: 15,
    padding: 10,
    flexShrink: 1,
  },
  commentImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
  },
  commentText: {
    fontSize: 15,
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: 10,
  },
  textArea: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    padding: 10,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: 'white',
  },
  postButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
  selectPicButton: {
    padding: 10,
    borderRadius: 10,
  },
  selectPicText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderWidth: 1,
    borderColor: '#FFC0CB',
    backgroundColor: '#fff8f9',
    borderRadius: 10,
    marginBottom: 5,
  },
  previewImg: {
    width: 70,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  imageSelectedText: {
    color: '#e63946',
    fontWeight: 'bold',
  },
  backText: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
});
