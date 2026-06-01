
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
    { icon: "information-circle-outline" as keyof typeof Ionicons.glyphMap, route: "/(tabs)/about", label: "About", path: "/about" },
    { icon: "logo-whatsapp" as keyof typeof Ionicons.glyphMap, route: "/contact", label: "Contact", path: "/contact" },
    { icon: "home-outline" as keyof typeof Ionicons.glyphMap, route: "/", label: "Home", path: "/" },
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

  const getIconName = (page: typeof pageIcons[0]) => {
    const active = isActive(page);
    if (page.label === "About") {
      return active ? "information-circle" : "information-circle-outline";
    }
    if (page.label === "Contact") {
      return "logo-whatsapp";
    }
    if (page.label === "Home") {
      return active ? "home" : "home-outline";
    }
    if (page.label === "Blogs") {
      return active ? "book" : "book-outline";
    }
    if (page.label === "Chat") {
      return active ? "chatbubble-ellipses" : "chatbubble-ellipses-outline";
    }
    return page.icon;
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
            <Text style={tw`text-white font-bold text-sm font-mono`}>My CV</Text>
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
                    tw`flex-col items-center p-2 rounded-2xl transition-all duration-200`,
                    isActive(page) && tw`bg-purple-600/10`,
                    pressed && tw`opacity-70`
                  ]}
                >
                  <Ionicons
                    name={getIconName(page)}
                    size={28}
                    color={isActive(page) ? "#9333ea" : "#4b5563"}
                  />
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
              tw`absolute bottom-0 left-0 right-0 border-t border-white/20 pt-2 pb-6 px-4`,
              { backgroundColor: 'rgba(114, 104, 91, 0.15)', overflow: 'hidden' }
            ]}
          >
            <View style={tw`flex-row  items-center justify-around w-full`}>
              {pageIcons.map((page, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleIconPress(page.route, page.label)}
                  style={({ pressed }) => [
                    tw`items-center justify-center py-1 flex-1 `,
                    pressed && tw`opacity-70`
                  ]}
                >
                  <View style={[
                    tw`w-12 h-10 rounded-full items-center justify-center  `,
                    isActive(page) ? tw` ` : tw`bg-transparent`
                  ]}>
                    <Ionicons
                      name={getIconName(page)}
                      size={32}
                      color={isActive(page) ? "#0b0635ff" : "#fff"}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          </BlurView>
        )}
      </View>
    </SafeScreen>
  );
}
