import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

interface ExpandableTabButtonProps {
  size: number;
  focused: boolean;
}

export default function ExpandableTabButton({
  size,
  focused,
}: ExpandableTabButtonProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const menuItems = [
    {
      icon: "logo-whatsapp" as keyof typeof Ionicons.glyphMap,
      color: "#25D366",
      route: "/whatsapp",
      hasNotification: false,
      onPress: () => {
        router.push("/whatsapp");
        setExpanded(false);
      },
    },
    {
      icon: "cube" as keyof typeof Ionicons.glyphMap,
      color: "#000000",
      route: "/cube",
      hasNotification: false,
      onPress: () => {
        router.push("/cube");
        setExpanded(false);
      },
    },
    {
      icon: "paper-plane" as keyof typeof Ionicons.glyphMap,
      color: "#000000",
      route: "/paper-plane",
      hasNotification: true,
      notificationColor: "#FF0000",
      onPress: () => {
        router.push("/paper-plane");
        setExpanded(false);
      },
    },
    {
      icon: "feather" as keyof typeof Ionicons.glyphMap,
      color: "#9333EA",
      route: "/feather",
      hasNotification: false,
      onPress: () => {
        router.push("/feather");
        setExpanded(false);
      },
    },
    {
      icon: "shield-checkmark" as keyof typeof Ionicons.glyphMap,
      color: "#3B82F6",
      route: "/shield",
      hasNotification: true,
      notificationColor: "#FFD700",
      notificationIcon: "warning",
      onPress: () => {
        router.push("/shield");
        setExpanded(false);
      },
    },
  ];

  return (
    <View className="relative">
      <Pressable onPress={() => setExpanded(!expanded)}>
        {focused ? (
          <LinearGradient
            colors={["#FF4D4D", "#FF0000"]}
            start={[0, 0]}
            end={[1, 1]}
            style={{
              borderRadius: 50,
              width: size + 8,
              height: size + 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="information-circle" size={size} color="white" />
          </LinearGradient>
        ) : (
          <View
            style={{
              width: size + 8,
              height: size + 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="information-circle" size={size} color="white" />
          </View>
        )}
      </Pressable>

      {expanded && (
        <>
          {/* Backdrop */}
          <Pressable
            style={{
              position: "absolute",
              top: -2000,
              left: -2000,
              right: -2000,
              bottom: -2000,
              zIndex: 998,
            }}
            onPress={() => setExpanded(false)}
          />
          {/* Expanded menu - positioned directly above tab bar */}
          <View
            className="absolute bg-gray-200 rounded-2xl p-4"
            style={{
              bottom: 90,
              left: "50%",
              marginLeft: -110,
              minWidth: 220,
              maxWidth: 240,
              zIndex: 999,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <View className="flex-row flex-wrap gap-3 justify-center items-center">
              {menuItems.map((item, index) => (
                <View key={index} className="relative">
                  <Pressable
                    onPress={item.onPress}
                    className="rounded-xl items-center justify-center"
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: item.color,
                    }}
                  >
                    <Ionicons name={item.icon} size={24} color="white" />
                  </Pressable>
                  {/* Notification dots */}
                  {item.hasNotification && (
                    <View
                      className="absolute -top-1 -right-1 rounded-full items-center justify-center"
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: item.notificationColor || "#FF0000",
                        borderWidth: 2,
                        borderColor: "#E5E7EB",
                      }}
                    >
                      {item.notificationIcon === "warning" ? (
                        <Ionicons name="warning" size={10} color="white" />
                      ) : (
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "white",
                          }}
                        />
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
}
