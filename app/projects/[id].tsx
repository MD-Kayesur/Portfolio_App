import { useRouter, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View, ScrollView, ActivityIndicator, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGetProjectByIdQuery } from "@/redux/feature/projects/projectApi";
import tw from 'twrnc';
import SafeScreen from "@/components/SafeScreen";

export default function ProjectDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: project, isLoading, error } = useGetProjectByIdQuery(id as string);

  const openLink = async (url: string) => {
    try {
      if (url) await Linking.openURL(url);
    } catch (err) {
      console.error("Failed to open link:", err);
    }
  };

  if (isLoading) {
    return (
      <SafeScreen>
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#9333ea" />
        </View>
      </SafeScreen>
    );
  }

  if (error || !project) {
    return (
      <SafeScreen>
        <View style={tw`flex-1 items-center justify-center p-6`}>
          <Ionicons name="alert-circle-outline" size={60} color="#ef4444" />
          <Text style={tw`text-xl text-white mt-4 font-bold text-center`}>Project not found</Text>
          <Pressable onPress={() => router.back()} style={tw`mt-6 bg-purple-600 px-6 py-2 rounded-full`}>
            <Text style={tw`text-white font-bold`}>Go Back</Text>
          </Pressable>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <ScrollView style={tw`flex-1`}>
        {/* Header with Back Button */}
        <View style={tw`p-6 pt-4`}>
          <Pressable
            onPress={() => router.back()}
            style={tw`bg-white/10 p-3 rounded-full self-start mb-6`}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          {/* Project Image Panel */}
          <View style={tw`w-full h-64 rounded-3xl overflow-hidden mb-8 border border-white/10`}>
            <Image
              source={{ uri: project.image }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
            {/* Overlay Gradient Placeholder */}
            <View style={[tw`absolute inset-0 bg-black/20`]} />
          </View>

          <Text style={tw`text-4xl font-extrabold text-white mb-2 font-['Fraunces']`}>
            {project.name}
          </Text>

          <View style={tw`flex-row flex-wrap gap-2 mt-4`}>
            <View style={tw`bg-purple-600/30 px-4 py-1.5 rounded-full border border-purple-500/30`}>
              <Text style={tw`text-purple-300 font-bold text-xs uppercase tracking-widest`}>Production Ready</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={tw`flex-1 bg-white/5 rounded-t-[40px] p-8 min-h-[500px]`}>
          <Text style={tw`text-purple-400 text-sm font-black mb-3 uppercase tracking-[4px]`}>The Vision</Text>
          <Text style={tw`text-gray-300 text-lg leading-7 mb-10`}>
            {project.description}
          </Text>

          <Text style={tw`text-purple-400 text-sm font-black mb-4 uppercase tracking-[4px]`}>Tech Ecosystem</Text>
          <View style={tw`flex-row flex-wrap gap-3 mb-12`}>
            {project.techStack.map((tech, index) => (
              <View key={index} style={tw`bg-white/10 px-5 py-3 rounded-2xl border border-white/5`}>
                <Text style={tw`text-white font-bold text-sm`}>{tech}</Text>
              </View>
            ))}
          </View>

          {/* Action Hub */}
          <View style={tw`flex-col gap-4 mb-20`}>
            {project.link && (
              <Pressable
                onPress={() => openLink(project.link)}
                style={tw`bg-purple-600 py-5 rounded-2xl flex-row items-center justify-center shadow-lg`}
              >
                <Ionicons name="logo-github" size={24} color="white" style={tw`mr-3`} />
                <Text style={tw`text-white text-lg font-black uppercase tracking-widest`}>Core Repository</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => router.push("/(tabs)/contact")}
              style={tw`bg-white/10 border border-white/20 py-5 rounded-2xl items-center`}
            >
              <Text style={tw`text-white text-lg font-bold`}>Collaborate on this Idea</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
