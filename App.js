import * as React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.homeContainer}>
      <Image
        source={require('./assets/naomiformalpic.jpg')}
        style={styles.homeProfilePic}
      />
      <Text style={styles.title}>Welcome, Naomi 🌸</Text>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('CommentBox')}
      >
        <Text style={styles.buttonText}>Go to Comment Box</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('ChatBox')}
      >
        <Text style={styles.buttonText}>Go to Chat Box</Text>
      </TouchableOpacity>
    </View>
  );
};

const CommentBoxScreen = ({ navigation }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const postComment = () => {
    if (comment.trim() !== '') {
      setComments([...comments, comment.trim()]);
      setComment('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.header}>Comment Box 🗨️</Text>

      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentRow}>
            <Image
              source={require('./assets/naomiformalpic.jpg')}
              style={styles.profilePic}
            />
            <Text style={styles.commentText}>{item}</Text>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Write a comment..."
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity style={styles.button} onPress={postComment}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const ChatBoxScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      setChat([...chat, message.trim()]);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.header}>Chat Box 💬</Text>

      <FlatList
        data={chat}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.chatRow}>
            <Image
              source={require('./assets/naomisings.jpg')}
              style={styles.profilePic}
            />
            <View style={styles.chatBubble}>
              <Text style={styles.chatText}>{item}</Text>
            </View>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={sendMessage}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CommentBox" component={CommentBoxScreen} />
        <Stack.Screen name="ChatBox" component={ChatBoxScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe6f0', // soft pink
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  homeProfilePic: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 15,
  },
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff0f5', // soft pink for chat & comment
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentText: {
    marginLeft: 10,
    fontSize: 16,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  chatBubble: {
    backgroundColor: '#e0f0ff',
    borderRadius: 10,
    padding: 10,
    marginLeft: 8,
    maxWidth: '80%',
  },
  chatText: {
    fontSize: 16,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    color: '#007BFF',
    fontWeight: '600',
  },
});
