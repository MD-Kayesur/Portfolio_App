import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { View, StyleSheet } from 'react-native';
import tw from 'twrnc';

import './global.css';


export default function RootLayout() {
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
