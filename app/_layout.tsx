
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '../utils/cache';
import { Video, ResizeMode } from 'expo-av';
import { View, StyleSheet, useColorScheme } from 'react-native';
import tw from 'twrnc';

import './global.css';

// Get publishable key from environment
let publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || '';

// Remove trailing $ if present (common issue when copying from terminal)
if (publishableKey.endsWith('$')) {
  publishableKey = publishableKey.slice(0, -1).trim();
}

// Validate publishable key format
if (!publishableKey) {
  console.error(
    '❌ Missing Clerk Publishable Key!\n' +
    'Please create a .env file in the root directory with:\n' +
    'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here\n' +
    'Make sure there are no quotes or special characters at the end.'
  );
} else if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
  console.warn(
    '⚠️ Clerk Publishable Key format appears invalid. ' +
    'It should start with "pk_test_" or "pk_live_". ' +
    'Current key starts with: ' + publishableKey.substring(0, 10) + '...'
  );
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Fix NativeWind color scheme for web
      try {
        const { StyleSheet } = require('react-native');
        if (StyleSheet.setFlag) {
          StyleSheet.setFlag('darkMode', 'class');
        }
      } catch (e) {
        // Ignore if not available
      }
    }
  }, []);

  if (!publishableKey) {
    return (
      <Provider store={store}>
        <View style={tw`flex-1`}>
          {/* Background Video */}
          <Video
            source={require('../assets/vedios/animate1.mp4')}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            isLooping
            isMuted
            shouldPlay
          />

          <View style={tw`flex-1`}>
            <Stack screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' }
            }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)/missing-key" />
              <Stack.Screen name="+not-found" options={{ headerShown: true }} />
            </Stack>
          </View>
        </View>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <ClerkProvider
        publishableKey={publishableKey}
        tokenCache={tokenCache}
        {...(Platform.OS === 'web' && {
          domain: undefined, // Let Clerk auto-detect
        })}
      >
        <View style={tw`flex-1`}>
          {/* Background Video */}
          <Video
            source={require('../assets/vedios/animate1.mp4')}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            isLooping
            isMuted
            shouldPlay
          />

          <View style={tw`flex-1`}>
            <Stack screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' } // Make screens transparent
            }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="projects" />
              <Stack.Screen name="(pages)" />
              <Stack.Screen name="+not-found" options={{ headerShown: true }} />
            </Stack>
          </View>
        </View>
      </ClerkProvider>
    </Provider>
  );
}
