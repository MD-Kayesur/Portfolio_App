
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Platform,
  StatusBar,
  Linking,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useState, useRef } from "react";
import SafeScreen from "@/components/SafeScreen";
import SplashScreen from "@/components/SplashScreen";
import LandingHero from "@/components/LandingHero";
import tw from 'twrnc';

import BottomNavigation from "@/components/BottomNavigation";

export default function LandingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);

  // Scroll Animation Logic for Tab Bar
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollYClamped = Animated.diffClamp(scrollY, 0, 100);
  const tabBarTranslateY = scrollYClamped.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });



  const handleDownloadCV = async () => {
    try {
      const cvUrl = "https://raw.githubusercontent.com/MD-Kayesur/Portfolio_App/main/assets/images/My_Resume%20(1).pdf";
      await Linking.openURL(cvUrl);
    } catch (error) {
      console.error("Failed to download CV:", error);
    }
  };

  return (
    <SafeScreen>
      {/* Dynamic Splash Screen Component */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Status bar handling */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[tw`flex-1`, { backgroundColor: 'transparent' }]}>
        {/* Fixed "My CV" Button - Top Right */}
        <View style={tw`absolute top-2 right-4 z-50`}>
          <TouchableOpacity
            onPress={handleDownloadCV}
            activeOpacity={0.8}
            style={tw`bg-purple-600 px-4 py-2 rounded-full flex-row items-center shadow-lg`}
          >
            <Ionicons name="download-outline" size={18} color="white" style={tw`mr-2`} />
            <Text style={tw`text-white font-bold text-sm font-mono`}>My CV</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content - Scrollable */}
        <Animated.ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`flex-grow pb-32`}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: Platform.OS !== 'web' }
          )}
          scrollEventThrottle={16}
        >
          {/* New Premium Landing Hero Component */}
          <LandingHero />
        </Animated.ScrollView>

        {/* Bottom Navigation */}
        <BottomNavigation translateY={tabBarTranslateY} />
      </View>
    </SafeScreen>
  );
}
