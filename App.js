import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import CommentBoxScreen from './components/CommentBoxScreen';
import ChatBoxScreen from './components/ChatBoxScreen';

export default function App() {
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
}
