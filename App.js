// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SQLiteProvider } from 'expo-sqlite';

// Screens
import HomeScreen from './components/HomeScreen';
import CommentBoxScreen from './components/CommentBoxScreen';
import ChatBoxScreen from './components/ChatBoxScreen';
import PrivateChatScreen from './components/PrivateChatScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SQLiteProvider
      databaseName="users.db"
      onInit={async (db) => {
        // --- DROP old messages table to avoid schema mismatch ---
        // WARNING: This will remove any existing messages stored in the old table.
        await db.execAsync(`DROP TABLE IF EXISTS messages;`);

        // Users table
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
          );
        `);

        // Messages table - FIXED: Changed "text" to "message"
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender TEXT NOT NULL,
            receiver TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp INTEGER NOT NULL
          );
        `);

        // Enable WAL for better concurrency
        await db.execAsync(`PRAGMA journal_mode=WAL;`);
      }}
      options={{ useNewConnection: false }}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CommentBox" component={CommentBoxScreen} options={{ title: 'Comment Box' }} />
          <Stack.Screen name="ChatBox" component={ChatBoxScreen} options={{ title: 'Chat Box' }} />
          <Stack.Screen name="PrivateChat" component={PrivateChatScreen} options={{ title: 'Private Chat' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}