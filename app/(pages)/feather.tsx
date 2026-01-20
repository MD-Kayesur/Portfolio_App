import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function FeatherPage() {
  return (
    <SafeAreaView className="flex-1 bg-purple-50">
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-purple-500 rounded-full p-8 mb-6">
          {/* <Ionicons name="feather" size={64} color="white" /> */}
        </View>
        <Text className="text-3xl font-bold text-gray-800 mb-4">
          Feather
        </Text>
        <Text className="text-center text-gray-600 mb-8">
          Lightweight and beautiful design
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-purple-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
