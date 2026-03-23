
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Platform,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import SplashScreen from "@/components/SplashScreen";
import LandingHero from "@/components/LandingHero";
import tw from 'twrnc';

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

      <View style={tw`flex-1 bg-white`}>
        {/* Main Content - Scrollable */}
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`flex-grow`}
          showsVerticalScrollIndicator={false}
        >
          {/* New Premium Landing Hero Component */}
          <LandingHero />
        </ScrollView>

        {/* Bottom Navigation - Fixed for mobile, different for web */}
        {Platform.OS === 'web' ? (
          // Web Navigation - Horizontal at bottom
          <View style={tw`border-t border-gray-200 py-4`}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`px-4 items-center justify-center gap-6`}
            >
              {pageIcons.map((page, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleIconPress(page.route, page.label)}
                  style={({ pressed }) => [
                    tw`items-center  p-2 rounded-xl transition-all duration-200`,
                    isActive(page) && tw`bg-red-50`,
                    pressed && tw`opacity-70`
                  ]}
                >
                  <View style={tw`relative`}>
                    <Ionicons
                      name={page.icon}
                      size={page.label === "Home" ? 28 : 24}
                      color={isActive(page) ? "#dc2626" : "#6b7280"}
                    />
                    {isActive(page) && (
                      <View style={tw`absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-red-600 rounded-full -ml-0.75`} />
                    )}
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      tw`text-xs mt-2 font-medium`,
                      isActive(page) ? tw`text-red-600` : tw`text-gray-500`
                    ]}
                  >
                    {page.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : (
          // Mobile Navigation - Compact at bottom
          <View style={tw`border-t border-gray-200 pt-3 pb-6 px-4`}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`items-center justify-between w-full gap-2`}
            >
              {pageIcons.map((page, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleIconPress(page.route, page.label)}
                  style={({ pressed }) => [
                    tw`flex-1 items-center p-2 min-w-16`,
                    pressed && tw`opacity-70`
                  ]}
                >
                  <View style={[
                    tw`w-12 h-12 rounded-full items-center justify-center mb-1`,
                    isActive(page) ? tw`bg-red-100` : tw`bg-gray-100`
                  ]}>
                    <Ionicons
                      name={page.icon}
                      size={page.label === "Home" ? 24 : 20}
                      color={isActive(page) ? "#dc2626" : "#6b7280"}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      tw`text-xs font-medium`,
                      isActive(page) ? tw`text-red-600` : tw`text-gray-500`
                    ]}
                  >
                    {page.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeScreen>
  );
}
