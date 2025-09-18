import React, { useState } from 'react';
import {
SafeAreaView,
View,
TextInput,
Text,
TouchableOpacity,
StyleSheet,
FlatList,
KeyboardAvoidingView,
Platform,
} from 'react-native';

export default function App() {
const [comment, setComment] = useState('');
const [comments, setComments] = useState([]);
const [message, setMessage] = useState('');
const [chat, setChat] = useState([]);

const postComment = () => {
if (comment.trim() !== '') {
setComments([...comments, comment.trim()]);
setComment('');
}
};

const sendMessage = () => {
if (message.trim() !== '') {
setChat([...chat, message.trim()]);
setMessage('');
}
};

return (
<SafeAreaView style={styles.safe}>
<KeyboardAvoidingView
style={styles.container}
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
{/* Comment Box */}
<View style={styles.section}>
<Text style={styles.header}>Comment Box</Text>
<TextInput  
style={styles.input}  
placeholder="Write a comment..."  
value={comment}  
onChangeText={setComment}  
/>
<TouchableOpacity style={styles.button} onPress={postComment}>
<Text style={styles.buttonText}>Post</Text>
</TouchableOpacity>
<FlatList
data={comments}
keyExtractor={(item, index) => index.toString()}
renderItem={({ item }) => (
<Text style={styles.listItem}>• {item}</Text>
)}
/>
</View>

{/* Chat Box */}  
    <View style={styles.section}>  
      <Text style={styles.header}>Chat Box</Text>  
      <FlatList  
        data={chat}  
        keyExtractor={(item, index) => index.toString()}  
        renderItem={({ item }) => (  
          <Text style={styles.listItem}>💬 {item}</Text>  
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
    </View>  
  </KeyboardAvoidingView>  
</SafeAreaView>

);
}

const styles = StyleSheet.create({
safe: {
flex: 1,
backgroundColor: '#fff',
},
container: {
flex: 1,
padding: 20,
},
section: {
marginBottom: 30,
},
header: {
fontSize: 18,
fontWeight: '600',
marginBottom: 10,
},
input: {
borderWidth: 1,
borderColor: '#888',
padding: 10,
borderRadius: 5,
marginBottom: 10,
},
button: {
backgroundColor: '#0066cc',
padding: 10,
borderRadius: 5,
alignItems: 'center',
marginBottom: 10,
},
buttonText: {
color: '#fff',
fontWeight: '500',
},
listItem: {
fontSize: 16,
paddingVertical: 4,
},
});

