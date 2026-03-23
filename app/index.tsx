
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import SplashScreen from "@/components/SplashScreen";
import LandingHero from "@/components/LandingHero";
import tw from 'twrnc';
import { BlurView } from 'expo-blur';

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const pageIcons = [
    { icon: "information-circle" as keyof typeof Ionicons.glyphMap, route: "/(tabs)/about", label: "About", path: "/about" },
    { icon: "logo-whatsapp" as keyof typeof Ionicons.glyphMap, route: "/whatsapp", label: "WhatsApp", path: "/whatsapp" },
    { icon: "home" as keyof typeof Ionicons.glyphMap, route: "/(tabs)", label: "Home", path: "/(tabs)" },
    { icon: "cube" as keyof typeof Ionicons.glyphMap, route: "/cube", label: "Cube", path: "/cube" },
    { icon: "book-outline" as keyof typeof Ionicons.glyphMap, route: "/blogs", label: "Blogs", path: "/blogs" },
  ];

  const handleIconPress = (route: string, label: string) => {
    setActiveIcon(label);
    router.push(route as any);
  };

  const isActive = (page: typeof pageIcons[0]) => {
    if (activeIcon) {
      return activeIcon === page.label;
    }
    return pathname.includes(page.path) || (page.path === "/(tabs)" && pathname === "/");
  };

  return (
    <SafeScreen>
      {/* Dynamic Splash Screen Component */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Status bar handling */}
      <StatusBar barStyle="light-content" backgroundColor="#064e3b" />

      <View style={[tw`flex-1`, { backgroundColor: '#064e3b' }]}>
        {/* Main Content - Scrollable */}
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`flex-grow pb-32`}
          showsVerticalScrollIndicator={false}
        >
          {/* New Premium Landing Hero Component */}
          <LandingHero />
        </ScrollView>

        {/* Bottom Navigation */}
        {Platform.OS === 'web' ? (
          // Web Navigation
          <View style={tw`border-t border-gray-100 py-3 bg-white/60 absolute bottom-0 left-0 right-0`}>
            <View style={tw`flex-row items-center justify-center gap-6 px-4`}>
              {pageIcons.map((page, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleIconPress(page.route, page.label)}
                  style={({ pressed }) => [
                    tw`items-center p-2 rounded-2xl transition-all duration-200`,
                    isActive(page) && tw`bg-red-50/80`,
                    pressed && tw`opacity-70`
                  ]}
                >
                  <Ionicons
                    name={page.icon}
                    size={28}
                    color={isActive(page) ? "#dc2626" : "#4b5563"}
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      tw`text-[10px] mt-1 font-bold`,
                      isActive(page) ? tw`text-red-600` : tw`text-gray-500`
                    ]}
                  >
                    {page.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          // Mobile Navigation - Glassmorphism Style
          <BlurView
            intensity={95}
            tint="light"
            style={[
              tw`absolute bottom-0 left-0 right-0 border-t border-white/20 pt-2 pb-6 px-2`,
              { backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' }
            ]}
          >
            <View style={tw`flex-row items-center justify-between w-full`}>
              {pageIcons.map((page, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleIconPress(page.route, page.label)}
                  style={({ pressed }) => [
                    tw`items-center justify-center py-1 flex-1`,
                    pressed && tw`opacity-70`
                  ]}
                >
                  <View style={[
                    tw`w-12 h-12 rounded-full items-center justify-center mb-0.5`,
                    isActive(page) ? tw`bg-red-50/50` : tw`bg-transparent`
                  ]}>
                    <Ionicons
                      name={page.icon}
                      size={26}
                      color={isActive(page) ? "#dc2626" : "#4b5563"}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      tw`text-[10px] font-bold`,
                      isActive(page) ? tw`text-red-600` : tw`text-gray-500`
                    ]}
                  >
                    {page.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </BlurView>
        )}
      </View>
    </SafeScreen>
  );
}
