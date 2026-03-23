import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import { ScrollView } from "react-native";

export default function CubePage() {
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-6 pt-10`}>
        <Pressable 
          onPress={() => router.back()}
          style={tw`p-3`}
        >
          <Ionicons name="arrow-back" size={28} color="#374151" />
        </Pressable>
        <Text style={tw`text-2xl font-bold text-gray-800 ml-4`}>Cube</Text>
      </View>

      {/* Main Content */}
      <ScrollView>
        <View style={tw`flex-1 items-center justify-center px-6`}>
        
        {/* Cube with Shadow */}
        <View style={tw`mb-8`}>
          <View style={tw`bg-gradient-to-br from-purple-500 to-pink-400 w-48 h-48 rounded-2xl items-center justify-center shadow-xl`}>
            <Ionicons name="cube" size={80} color="white" />
          </View>
        </View>

        {/* Title */}
        <Text style={tw`text-3xl font-bold text-gray-800 mb-3`}>
          3D Cube Explorer
        </Text>
        
        {/* Description */}
        <Text style={tw`text-center text-gray-600 mb-8 text-lg max-w-xs`}>
          Interactive 3D visualization with touch controls
        </Text>

        {/* Features */}
        <View style={tw`flex-row gap-6 mb-10`}>
          <View style={tw`items-center`}>
            <View style={tw`bg-purple-100 w-12 h-12 rounded-xl items-center justify-center mb-2`}>
              <Ionicons name="move" size={24} color="#8b5cf6" />
            </View>
            <Text style={tw`text-gray-700 text-sm`}>Rotate</Text>
          </View>
          <View style={tw`items-center`}>
            <View style={tw`bg-pink-100 w-12 h-12 rounded-xl items-center justify-center mb-2`}>
              <Ionicons name="expand" size={24} color="#ec4899" />
            </View>
            <Text style={tw`text-gray-700 text-sm`}>Zoom</Text>
          </View>
          <View style={tw`items-center`}>
            <View style={tw`bg-blue-100 w-12 h-12 rounded-xl items-center justify-center mb-2`}>
              <Ionicons name="color-palette" size={24} color="#3b82f6" />
            </View>
            <Text style={tw`text-gray-700 text-sm`}>Colors</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={tw`flex-row gap-4 w-full max-w-xs`}>
          <Pressable
            onPress={() => console.log("Explore 3D")}
            style={({ pressed }) => [
              tw`flex-1 bg-purple-600 px-6 py-4 rounded-xl items-center`,
              pressed && tw`bg-purple-700`
            ]}
          >
            <Text style={tw`text-white font-bold text-lg`}>Explore</Text>
          </Pressable>
          
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              tw`bg-gray-200 px-6 py-4 rounded-xl`,
              pressed && tw`bg-gray-300`
            ]}
          >
            <Text style={tw`text-gray-800 font-bold`}>Back</Text>
          </Pressable>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}