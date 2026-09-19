import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ShieldPage() {
  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-blue-500 rounded-full p-8 mb-6">
          <Ionicons name="shield-checkmark" size={64} color="white" />
        </View>
        <Text className="text-3xl font-bold text-gray-800 mb-4">
          Security
        </Text>
        <Text className="text-center text-gray-600 mb-8">
          Your data is safe and secure
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-blue-500 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
