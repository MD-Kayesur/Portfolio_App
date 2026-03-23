
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
import tw from 'twrnc';

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/(tabs)");
    } else {
      router.push("/(auth)/sign-in");
    }
  };

  const pageIcons = [
    { icon: "information-circle" as keyof typeof Ionicons.glyphMap, route: "/(tabs)/about", label: "About", path: "/about" },
    { icon: "logo-whatsapp" as keyof typeof Ionicons.glyphMap, route: "/whatsapp", label: "WhatsApp", path: "/whatsapp" },
    { icon: "home" as keyof typeof Ionicons.glyphMap, route: "/(tabs)", label: "Home", path: "/(tabs)" },
    { icon: "cube" as keyof typeof Ionicons.glyphMap, route: "/cube", label: "Cube", path: "/cube" },
    // { icon: "paper-plane" as keyof typeof Ionicons.glyphMap, route: "/paper-plane", label: "Paper", path: "/paper-plane" },
    // { icon: "feather" as keyof typeof Ionicons.glyphMap, route: "/feather", label: "Feather", path: "/feather" },
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
      {/* Status bar handling */}
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={tw`flex-1 bg-white`}>
        {/* Main Content - Scrollable */}
        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`flex-grow items-center justify-center px-6 py-10`}
          showsVerticalScrollIndicator={false}
        >
          {/* App Logo/Icon */}
          <View style={tw`mb-8`}>
            <View style={tw`w-24 h-24 rounded-full bg-red-100 items-center justify-center mx-auto mb-4`}>
              <Ionicons name="fitness" size={48} color="#dc2626" />
            </View>
          </View>

          {/* Welcome Text */}
          <Text style={tw`text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2`}>
            Welcome to FitLife
          </Text>

          <Text style={tw`text-2xl md:text-3xl font-bold text-red-600 text-center mb-6`}>
            MD_Kayesur
          </Text>

          {/* Description */}
          <Text style={tw`text-base md:text-lg text-gray-600 text-center leading-relaxed mb-10 max-w-md`}>
            Start your fitness journey with us. Train hard, stay consistent, and achieve your goals step by step. Transform your body and mind.
          </Text>

          {/* Get Started Button */}
          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => [
              tw`bg-red-600 px-10 py-4 rounded-full shadow-lg`,
              pressed && tw`bg-red-700 opacity-90`
            ]}
          >
            <Text style={tw`text-white font-bold text-lg`}>
              CLONE & GET STARTED NOW
            </Text>
          </Pressable>

          {/* Features Grid (Visible on larger screens) */}
          <View style={tw`hidden md:flex flex-row flex-wrap justify-center mt-12 gap-6 max-w-2xl`}>
            {[
              { icon: "barbell", label: "Workout Plans" },
              { icon: "nutrition", label: "Nutrition Guide" },
              { icon: "stats-chart", label: "Progress Track" },
              { icon: "people", label: "Community" }
            ].map((feature, index) => (
              <View key={index} style={tw`items-center p-4`}>
                <View style={tw`w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-3`}>
                  <Ionicons name={feature.icon as any} size={28} color="#dc2626" />
                </View>
                <Text style={tw`text-gray-700 font-medium`}>{feature.label}</Text>
              </View>
            ))}
          </View>
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






