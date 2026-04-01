
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Platform,
  StatusBar,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import SplashScreen from "@/components/SplashScreen";
import LandingHero from "@/components/LandingHero";
import tw from 'twrnc';
import { BlurView } from 'expo-blur';

export default function LandingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  const pageIcons = [
    { icon: "information-circle" as keyof typeof Ionicons.glyphMap, route: "/(tabs)/about", label: "About", path: "/about" },
    { icon: "logo-whatsapp" as keyof typeof Ionicons.glyphMap, route: "/whatsapp", label: "WhatsApp", path: "/whatsapp" },
    { icon: "home" as keyof typeof Ionicons.glyphMap, route: "/", label: "Home", path: "/" },
    { icon: "book-outline" as keyof typeof Ionicons.glyphMap, route: "/blogs", label: "Blogs", path: "/blogs" },
    { icon: "chatbubble-ellipses-outline" as keyof typeof Ionicons.glyphMap, route: "/ai-assistant", label: "Chat", path: "/ai-assistant" },

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
            <Text style={tw`text-white font-bold text-sm`}>My CV</Text>
          </TouchableOpacity>
        </View>

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
              tw`absolute bottom-0 left-0 right-0 border-t border-white/20 pt-4 pb-10 px-4`,
              { backgroundColor: 'rgba(255,255,255,0.4)', overflow: 'hidden' }
            ]}
          >
            <View style={tw`flex-row items-center justify-around w-full`}>
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
                    tw`w-12 h-12 rounded-full items-center justify-center mb-1.5`,
                    isActive(page) ? tw`bg-red-50/60` : tw`bg-transparent`
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
                      tw`text-xs font-bold`,
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
