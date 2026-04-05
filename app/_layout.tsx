import { Stack, usePathname } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect, useRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import tw from 'twrnc';

// Safely try to require Clarity to avoid crashes in Expo Go or non-native environments
let Clarity: any = null;
if (Platform.OS !== 'web') {
  try {
    Clarity = require('@microsoft/react-native-clarity');
  } catch (e) {
    console.warn('Clarity native module not found, probably running in Expo Go.');
  }
}

import './global.css';


export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Clarity if available (will be null on web or in Expo Go)
    if (Clarity) {
      try {
        Clarity.initialize('w6w21qto5q', {
          logLevel: Clarity.LogLevel?.None ?? 0,
        });
      } catch (e) {
        console.warn('Clarity failed to initialize:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (Clarity && pathname) {
      try {
        Clarity.setCurrentScreenName(pathname);
      } catch (e) {
        // Ignore
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        const { StyleSheet } = require('react-native');
        if (StyleSheet.setFlag) {
          StyleSheet.setFlag('darkMode', 'class');
        }
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const player = useVideoPlayer(require('../assets/vedios/animate1.mp4'), (player) => {
    player.loop = true;
    player.play();
    player.muted = true;
  });

  return (
    <Provider store={store}>
      <View style={tw`flex-1`}>
        {/* Background Video */}
        <VideoView
          style={StyleSheet.absoluteFill}
          player={player}
          contentFit="cover"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />

        <View style={tw`flex-1`}>
          <Stack screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' }
          }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="projects" />
            <Stack.Screen name="(pages)" />
            <Stack.Screen name="+not-found" options={{ headerShown: true }} />
          </Stack>
        </View>
      </View>
    </Provider>
  );
}
