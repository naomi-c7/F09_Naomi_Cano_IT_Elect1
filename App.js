// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SQLiteProvider } from 'expo-sqlite';

// Import Screens
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
import ChatListScreen from './components/ChatListScreen';
import ChatScreen from './components/ChatScreen';
import AboutScreen from './components/AboutScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SQLiteProvider
      databaseName="cano_app.db"
      onInit={async (db) => {
        try {
          // DON'T drop tables - this keeps your data!
          // Only drop if you need to change the database structure

          // DON'T drop tables - this keeps your data!
          // Only drop if you need to change the database structure

          // Users table with profile picture
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              firstName TEXT NOT NULL,
              lastName TEXT NOT NULL,
              email TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL,
              birthday TEXT NOT NULL,
              profilePicture TEXT,
              bio TEXT,
              createdAt INTEGER DEFAULT (strftime('%s', 'now'))
            );
          `);

          // Posts table
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS posts (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId INTEGER NOT NULL,
              imageUri TEXT NOT NULL,
              caption TEXT,
              createdAt INTEGER DEFAULT (strftime('%s', 'now')),
              FOREIGN KEY (userId) REFERENCES users (id)
            );
          `);

          // Comments table
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS comments (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              postId INTEGER NOT NULL,
              userId INTEGER NOT NULL,
              comment TEXT NOT NULL,
              createdAt INTEGER DEFAULT (strftime('%s', 'now')),
              FOREIGN KEY (postId) REFERENCES posts (id),
              FOREIGN KEY (userId) REFERENCES users (id)
            );
          `);

          // Likes table
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS likes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              postId INTEGER NOT NULL,
              userId INTEGER NOT NULL,
              createdAt INTEGER DEFAULT (strftime('%s', 'now')),
              FOREIGN KEY (postId) REFERENCES posts (id),
              FOREIGN KEY (userId) REFERENCES users (id),
              UNIQUE(postId, userId)
            );
          `);

          // Messages table
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS messages (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              senderId INTEGER NOT NULL,
              receiverId INTEGER NOT NULL,
              message TEXT NOT NULL,
              createdAt INTEGER DEFAULT (strftime('%s', 'now')),
              FOREIGN KEY (senderId) REFERENCES users (id),
              FOREIGN KEY (receiverId) REFERENCES users (id)
            );
          `);

          // Enable WAL mode for better performance
          await db.execAsync(`PRAGMA journal_mode=WAL;`);

          console.log('✅ Database initialized successfully!');
        } catch (error) {
          console.error('❌ Database initialization error:', error);
        }
      }}
      options={{ useNewConnection: false }}
    >
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FFB6E1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ title: 'Profile' }} 
          />
          <Stack.Screen 
            name="ChatList" 
            component={ChatListScreen} 
            options={{ title: 'Messages' }} 
          />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen} 
            options={({ route }) => ({ title: route.params?.userName || 'Chat' })} 
          />
          <Stack.Screen 
            name="About" 
            component={AboutScreen} 
            options={{ title: 'About' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}