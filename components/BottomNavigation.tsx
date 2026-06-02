import React, { useState } from 'react';
import { Pressable, View, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import tw from 'twrnc';

interface BottomNavigationProps {
  translateY: Animated.AnimatedInterpolation<number> | Animated.Value;
}

const pageIcons = [
  { icon: "information-circle-outline" as keyof typeof Ionicons.glyphMap, route: "/(tabs)/about", label: "About", path: "/about" },
  { icon: "logo-whatsapp" as keyof typeof Ionicons.glyphMap, route: "/contact", label: "Contact", path: "/contact" },
  { icon: "home-outline" as keyof typeof Ionicons.glyphMap, route: "/", label: "Home", path: "/" },
  { icon: "book-outline" as keyof typeof Ionicons.glyphMap, route: "/blogs", label: "Blogs", path: "/blogs" },
  { icon: "chatbubble-ellipses-outline" as keyof typeof Ionicons.glyphMap, route: "/ai-assistant", label: "Chat", path: "/ai-assistant" },
];

export default function BottomNavigation({ translateY }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

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

  if (Platform.OS === 'web') {
    return (
      <Animated.View style={[tw`border-t border-gray-100 py-3  absolute bottom-0 left-0 right-0`, { transform: [{ translateY }] }]}>
        <View style={tw`flex-row items-center justify-center gap-6 px-4`}>
          {pageIcons.map((page, index) => (
            <Pressable
              key={index}
              onPress={() => handleIconPress(page.route, page.label)}
              style={({ pressed }) => [
                tw`flex-col items-center p-2 transition-all duration-200`,
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
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        tw`absolute bottom-0 left-0 right-0 pt-2 pb-6 px-4`,
        { transform: [{ translateY }] }
      ]}
    >
      <View style={tw`flex-row  items-center justify-around w-full`}>
        {pageIcons.map((page, index) => (
          <Pressable
            key={index}
            onPress={() => handleIconPress(page.route, page.label)}
            style={({ pressed }) => [
              tw`items-center justify-center py-1 flex-1`,
              pressed && tw`opacity-70`
            ]}
          >
            <Ionicons
              name={getIconName(page)}
              size={32}
              color={isActive(page) ? "#e908f9ff" : "#fbf8faff"}
            />
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}
