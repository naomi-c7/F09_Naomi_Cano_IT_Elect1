import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const PROFILE_PIC = require('../assets/naomiformalpic.jpg');
const MOCK_IMAGE = require('../assets/naomisings.jpg');

const CommentBoxScreen = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const flatListRef = useRef();

  const postComment = () => {
    if (comment.trim() === '') return;
    setIsPosting(true);
    const newComment = { text: comment.trim(), timestamp: Date.now() };

    setTimeout(() => {
      setComments([newComment, ...comments]); // Add new comment on top
      setComment('');
      setIsPosting(false);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screenContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 90}
    >
      <View style={styles.postBox}>
        <View style={styles.postHeader}>
          <Image source={PROFILE_PIC} style={styles.commentProfilePic} />
          <Text style={styles.postUser}>Naomi 🌸</Text>
        </View>

        <Image source={MOCK_IMAGE} style={styles.postImage} />
        <Text style={styles.postCaption}>🎤 Naomi shared a moment!</Text>

        {/* Comments list */}
        <FlatList
          ref={flatListRef}
          data={comments}
          keyExtractor={(item) => item.timestamp.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Image source={PROFILE_PIC} style={styles.commentProfilePicSmall} />
              <View style={styles.commentBubble}>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            </View>
          )}
          inverted // This makes newest comments appear at bottom
          contentContainerStyle={{ paddingTop: 10 }}
        />

        {/* Input and button */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textArea}
            placeholder="Write a comment..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
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
              {isPosting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommentBoxScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffe6f0',
    padding: 10,
  },
  postBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ffd1dc',
    flex: 1,
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
  commentItem: {
    flexDirection: 'row',
    marginBottom: 8,
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
    alignItems: 'center',
    marginTop: 10,
  },
  textArea: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    minHeight: 40,
    maxHeight: 100,
  },
  postButton: {
    marginLeft: 8,
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
});
