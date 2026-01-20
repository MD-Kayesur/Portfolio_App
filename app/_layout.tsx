
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/store'; // ⚠️ Updated import path
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

// Only import CSS on web - NativeWind handles mobile automatically via Metro
if (Platform.OS === 'web') {
  require('./global.css');
}

// Get publishable key from environment
// Remove any trailing $ or special characters that might have been added
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
}

// Check if key format is valid (should start with pk_test_ or pk_live_)
if (publishableKey && !publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
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

  // If no publishable key, still provide ClerkProvider with empty key
  // This allows components to use useAuth() without crashing
  // Components should handle the case when auth isn't available
  if (!publishableKey) {
    return (
      <Provider store={store}> {/* ⚠️ Moved Redux Provider outside */}
        <ClerkProvider 
          publishableKey="" 
          tokenCache={tokenCache}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen 
              name="(auth)/missing-key" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="(auth)" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen name="(pages)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ClerkProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}> {/* ⚠️ Redux Provider at the top level */}
      <ClerkProvider 
        publishableKey={publishableKey} 
        tokenCache={tokenCache}
        // Add web-specific configuration
        {...(Platform.OS === 'web' && {
          domain: undefined, // Let Clerk auto-detect
        })}
      >
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="workout" options={{ headerShown: false }} />
          <Stack.Screen name="(pages)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ClerkProvider>
    </Provider>
  );
}









// import { Stack, Redirect } from 'expo-router';
// import { Provider } from 'react-redux';
// import { store } from '../store';
// import { useEffect } from 'react';
// import { Platform } from 'react-native';
// import { ClerkProvider } from '@clerk/clerk-expo';
// import { tokenCache } from '@clerk/clerk-expo/token-cache';

// // Only import CSS on web - NativeWind handles mobile automatically via Metro
// if (Platform.OS === 'web') {
//   require('./global.css');
// }

// // Get publishable key from environment
// // Remove any trailing $ or special characters that might have been added
// let publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || '';

// // Remove trailing $ if present (common issue when copying from terminal)
// if (publishableKey.endsWith('$')) {
//   publishableKey = publishableKey.slice(0, -1).trim();
// }

// // Validate publishable key format
// if (!publishableKey) {
//   console.error(
//     '❌ Missing Clerk Publishable Key!\n' +
//     'Please create a .env file in the root directory with:\n' +
//     'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here\n' +
//     'Make sure there are no quotes or special characters at the end.'
//   );
// }

// // Check if key format is valid (should start with pk_test_ or pk_live_)
// if (publishableKey && !publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
//   console.warn(
//     '⚠️ Clerk Publishable Key format appears invalid. ' +
//     'It should start with "pk_test_" or "pk_live_". ' +
//     'Current key starts with: ' + publishableKey.substring(0, 10) + '...'
//   );
// }

// export default function RootLayout() {
//   useEffect(() => {
//     if (Platform.OS === 'web') {
//       // Fix NativeWind color scheme for web
//       try {
//         const { StyleSheet } = require('react-native');
//         if (StyleSheet.setFlag) {
//           StyleSheet.setFlag('darkMode', 'class');
//         }
//       } catch (e) {
//         // Ignore if not available
//       }
//     }
//   }, []);

//   // If no publishable key, still provide ClerkProvider with empty key
//   // This allows components to use useAuth() without crashing
//   // Components should handle the case when auth isn't available
//   if (!publishableKey) {
//     return (
//       <ClerkProvider 
//         publishableKey="" 
//         tokenCache={tokenCache}
//       >
//         <Provider store={store}>
//           <Stack>
//             <Stack.Screen name="index" options={{ headerShown: false }} />
//             <Stack.Screen 
//               name="(auth)/missing-key" 
//               options={{ 
//                 headerShown: false,
//               }} 
//             />
//             <Stack.Screen 
//               name="(auth)" 
//               options={{ 
//                 headerShown: false,
//               }} 
//             />
//             <Stack.Screen 
//               name="(tabs)" 
//               options={{ 
//                 headerShown: false,
//               }} 
//             />
//             <Stack.Screen name="(pages)" options={{ headerShown: false }} />
//             <Stack.Screen name="+not-found" />
//           </Stack>
//         </Provider>
//       </ClerkProvider>
//     );
//   }

//   return (
//     <ClerkProvider 
//       publishableKey={publishableKey} 
//       tokenCache={tokenCache}
//       // Add web-specific configuration
//       {...(Platform.OS === 'web' && {
//         domain: undefined, // Let Clerk auto-detect
//       })}
//     >
//       <Provider store={store}>
//         <Stack>
//           <Stack.Screen name="index" options={{ headerShown: false }} />
//           <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen name="workout" options={{ headerShown: false }} />
//           <Stack.Screen name="(pages)" options={{ headerShown: false }} />
//           <Stack.Screen name="+not-found" />
//         </Stack>
//       </Provider>
//     </ClerkProvider>
//   );
// }
