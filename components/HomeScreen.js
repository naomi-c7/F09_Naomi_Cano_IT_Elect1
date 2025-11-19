// components/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';

export default function HomeScreen({ route, navigation }) {
  const db = useSQLiteContext();
  const { userId, userName, userFullName } = route.params || {};
  
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  
  // Comment Modal States
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const allPosts = await db.getAllAsync(`
        SELECT 
          posts.*,
          users.firstName,
          users.lastName,
          users.profilePicture,
          (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id) as likeCount,
          (SELECT COUNT(*) FROM comments WHERE comments.postId = posts.id) as commentCount,
          (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id AND likes.userId = ?) as userLiked
        FROM posts
        JOIN users ON posts.userId = users.id
        ORDER BY posts.createdAt DESC
      `, [userId]);
      
      setPosts(allPosts);
      setRefreshing(false);
    } catch (err) {
      console.error('Error loading posts:', err);
      setRefreshing(false);
    }
  };

  const loadComments = async (postId) => {
    try {
      const postComments = await db.getAllAsync(`
        SELECT 
          comments.*,
          users.firstName,
          users.lastName,
          users.profilePicture
        FROM comments
        JOIN users ON comments.userId = users.id
        WHERE comments.postId = ?
        ORDER BY comments.createdAt DESC
      `, [postId]);
      
      setComments(postComments);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const openCommentModal = async (post) => {
    setSelectedPost(post);
    await loadComments(post.id);
    setShowCommentModal(true);
  };

  const addComment = async () => {
    if (newComment.trim() === '') {
      Alert.alert('Empty comment', 'Please write something!');
      return;
    }

    try {
      await db.runAsync(
        'INSERT INTO comments (postId, userId, comment) VALUES (?, ?, ?)',
        [selectedPost.id, userId, newComment.trim()]
      );
      
      setNewComment('');
      await loadComments(selectedPost.id);
      await loadPosts();
      
      Alert.alert('Success! 💬', 'Comment added!');
    } catch (err) {
      console.error('Error adding comment:', err);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const createPost = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowPostModal(true);
    }
  };

  const handlePost = async () => {
    if (!selectedImage) return;
    
    try {
      await db.runAsync(
        'INSERT INTO posts (userId, imageUri, caption) VALUES (?, ?, ?)',
        [userId, selectedImage, caption.trim()]
      );
      Alert.alert('Success! 🎉', 'Your post has been shared!');
      setShowPostModal(false);
      setSelectedImage(null);
      setCaption('');
      loadPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const toggleLike = async (postId, currentlyLiked) => {
    try {
      if (currentlyLiked) {
        await db.runAsync(
          'DELETE FROM likes WHERE postId = ? AND userId = ?',
          [postId, userId]
        );
      } else {
        await db.runAsync(
          'INSERT INTO likes (postId, userId) VALUES (?, ?)',
          [postId, userId]
        );
      }
      loadPosts();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        {item.profilePicture ? (
          <Image source={{ uri: item.profilePicture }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.firstName.charAt(0)}{item.lastName.charAt(0)}
            </Text>
          </View>
        )}
        <View>
          <Text style={styles.posterName}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.postTime}>Just now</Text>
        </View>
      </View>

      <Image source={{ uri: item.imageUri }} style={styles.postImage} />

      {item.caption ? (
        <Text style={styles.caption}>{item.caption}</Text>
      ) : null}

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleLike(item.id, item.userLiked)}
        >
          <Text style={styles.actionIcon}>{item.userLiked ? '❤️' : '🤍'}</Text>
          <Text style={styles.actionText}>{item.likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => openCommentModal(item)}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{item.commentCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      {item.profilePicture ? (
        <Image source={{ uri: item.profilePicture }} style={styles.commentAvatar} />
      ) : (
        <View style={styles.commentAvatarPlaceholder}>
          <Text style={styles.commentAvatarText}>
            {item.firstName.charAt(0)}{item.lastName.charAt(0)}
          </Text>
        </View>
      )}
      <View style={styles.commentContent}>
        <Text style={styles.commentAuthor}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.commentText}>{item.comment}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#E0C3FC', '#FFB6E1', '#FEC4D9']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Momento ✨</Text>
        <Text style={styles.headerSubtitle}>Hi, {userName}! 🌸</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.feedContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadPosts();
          }} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share a moment!</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.createButton} onPress={createPost}>
        <LinearGradient
          colors={['#FFB6E1', '#C49FF0']}
          style={styles.createButtonGradient}
        >
          <Text style={styles.createButtonText}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={showPostModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowPostModal(false);
          setSelectedImage(null);
          setCaption('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Post</Text>
            
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            )}
            
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption... (optional)"
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={200}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowPostModal(false);
                  setSelectedImage(null);
                  setCaption('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handlePost}>
                <LinearGradient
                  colors={['#FFB6E1', '#C49FF0']}
                  style={styles.postButton}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCommentModal}
        animationType="slide"
        onRequestClose={() => setShowCommentModal(false)}
      >
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={['#E0C3FC', '#FFB6E1', '#FEC4D9']}
            style={{ flex: 1 }}
          >
            <View style={styles.commentHeader}>
              <TouchableOpacity onPress={() => setShowCommentModal(false)}>
                <Text style={styles.backButton}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.commentHeaderTitle}>Comments</Text>
              <View style={{ width: 50 }} />
            </View>

            {selectedPost && (
              <View style={styles.postPreview}>
                <View style={styles.postPreviewHeader}>
                  {selectedPost.profilePicture ? (
                    <Image source={{ uri: selectedPost.profilePicture }} style={styles.smallAvatar} />
                  ) : (
                    <View style={styles.smallAvatarPlaceholder}>
                      <Text style={styles.smallAvatarText}>
                        {selectedPost.firstName.charAt(0)}{selectedPost.lastName.charAt(0)}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.postPreviewAuthor}>
                    {selectedPost.firstName} {selectedPost.lastName}
                  </Text>
                </View>
                {selectedPost.caption ? (
                  <Text style={styles.postPreviewCaption}>{selectedPost.caption}</Text>
                ) : null}
              </View>
            )}

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.commentsList}
                keyboardShouldPersistTaps="handled"
              >
                {comments.length === 0 ? (
                  <View style={styles.emptyComments}>
                    <Text style={styles.emptyCommentsText}>No comments yet</Text>
                    <Text style={styles.emptyCommentsSubtext}>Be the first to comment!</Text>
                  </View>
                ) : (
                  comments.map((item) => (
                    <View key={item.id.toString()} style={styles.commentItem}>
                      {item.profilePicture ? (
                        <Image source={{ uri: item.profilePicture }} style={styles.commentAvatar} />
                      ) : (
                        <View style={styles.commentAvatarPlaceholder}>
                          <Text style={styles.commentAvatarText}>
                            {item.firstName.charAt(0)}{item.lastName.charAt(0)}
                          </Text>
                        </View>
                      )}
                      <View style={styles.commentContent}>
                        <Text style={styles.commentAuthor}>{item.firstName} {item.lastName}</Text>
                        <Text style={styles.commentText}>{item.comment}</Text>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>

              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  maxLength={300}
                />
                <TouchableOpacity
                  onPress={addComment}
                  disabled={newComment.trim() === ''}
                >
                  <LinearGradient
                    colors={newComment.trim() ? ['#FFB6E1', '#C49FF0'] : ['#ccc', '#ccc']}
                    style={styles.sendCommentButton}
                  >
                    <Text style={styles.sendCommentText}>Send</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </LinearGradient>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏡</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('ChatList', { userId })}
        >
          <Text style={styles.navIcon}>💌</Text>
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile', { userId })}
        >
          <Text style={styles.navIcon}>✨</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingTop: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 3,
  },
  feedContent: {
    padding: 10,
    paddingBottom: 80,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#C49FF0',
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#C49FF0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  posterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  caption: {
    fontSize: 15,
    color: '#333',
    marginTop: 12,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  createButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  createButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#F8F8F8',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C49FF0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#C49FF0',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButton: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  commentHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  postPreview: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 12,
  },
  postPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  smallAvatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#C49FF0',
  },
  smallAvatarPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#C49FF0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  smallAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  postPreviewAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  postPreviewCaption: {
    fontSize: 14,
    color: '#666',
  },
  commentsList: {
    padding: 10,
    paddingBottom: 20,
  },
  commentItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#C49FF0',
  },
  commentAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C49FF0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  commentAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 3,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  emptyComments: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyCommentsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  emptyCommentsSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 15,
  },
  sendCommentButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendCommentText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});