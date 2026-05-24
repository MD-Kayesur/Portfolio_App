import { useGetProjectByIdQuery, Project } from "@/redux/feature/projects/projectApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View, ScrollView, Image, Linking, ActivityIndicator, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from 'twrnc';
import SafeScreen from "@/components/SafeScreen";

const { width } = Dimensions.get('window');

// Interface is now imported from projectApi

const LOCAL_APP_PROJECT: Project = {
  _id: "portfolio-app-id",
  name: "Portfolio Mobile Masterpiece",
  description: "A high-performance personal portfolio mobile application built with React Native and Expo, featuring a premium glassmorphism design and smooth background animations.",
  skills: ["Expo", "React Native", "NativeWind", "RTK Query"],
  implementation: "Engineered a global state management system using Redux. Created a seamless experience with background video rendering and smooth shared element transitions across all major pages.",
  liveLink: "https://expo.dev/accounts/md_kayesur/projects/rideshare/builds/3a4d3f4d-a2b3-4d15-bc59-4438ee2b8d32",
  codeLink: "https://github.com/MD-Kayesur/Portfolio_App",
  serverCodeLink: "https://github.com/MD-Kayesur/My-Own-Portfolio-server",
  image: "/app_screenshot_1.png",
  images: [
    "/app_screenshot_1.png",
    "/app_screenshot_2.png",
    "/app_screenshot_3.png",
    "/app_screenshot_4.png"
  ]
};

const getProjectImageSource = (imageStr: string) => {
  if (!imageStr) {
    return { uri: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000' };
  }
  if (imageStr.includes('app_screenshot_1.png')) {
    return require('@/assets/images/app_screenshot_1.png');
  }
  if (imageStr.includes('app_screenshot_2.png')) {
    return require('@/assets/images/app_screenshot_2.png');
  }
  if (imageStr.includes('app_screenshot_3.png')) {
    return require('@/assets/images/app_screenshot_3.png');
  }
  if (imageStr.includes('app_screenshot_4.png')) {
    return require('@/assets/images/app_screenshot_4.png');
  }
  return { uri: imageStr };
};

export default function ProjectDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const isApp = id === 'portfolio-app-id';

  // Fetch project data from API
  const { data: apiProject, isLoading: apiLoading, isError: apiError } = useGetProjectByIdQuery(
    id as string,
    { skip: isApp }
  );

  const project = isApp ? LOCAL_APP_PROJECT : apiProject;
  const isLoading = isApp ? false : apiLoading;
  const isError = isApp ? false : apiError;

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
        <View style={tw`flex-1 items-center justify-center p-6`}>
          <ActivityIndicator size="large" color="#9333ea" />
          <Text style={tw`text-white mt-4`}>Loading details...</Text>
        </View>
      </SafeScreen>
    );
  }

  if (isError || !project) {
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
    <SafeAreaView style={tw`flex-1`}>
      {/* Sticky Back Button Overlay */}
      <View style={tw`absolute top-12 left-6 z-50`}>
        <Pressable
          onPress={() => router.back()}
          style={tw`bg-black/60 p-3 rounded-full border border-white/10 shadow-2xl`}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={tw`p-6 pt-24`}>
          {/* Project Image Panel */}
          {project.images && project.images.length > 0 ? (
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false} 
              style={tw`mb-8 h-[400px]`}
              contentContainerStyle={tw`gap-4`}
            >
              {project.images.map((img, index) => (
                <View 
                  key={index} 
                  style={[
                    tw`rounded-3xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center`,
                    { width: width - 48, height: 400 }
                  ]}
                >
                  <Image
                    source={getProjectImageSource(img)}
                    style={tw`w-full h-full`}
                    resizeMode="contain"
                  />
                  <View style={[tw`absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 rounded-full border border-white/10`]}>
                    <Text style={tw`text-white text-xs font-bold`}>{index + 1} / {project.images?.length || 0}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={tw`w-full h-64 rounded-3xl overflow-hidden mb-8 border border-white/10`}>
              <Image
                source={getProjectImageSource(project.image)}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
              <View style={[tw`absolute inset-0 bg-black/40`]} />
            </View>
          )}

          <Text style={tw`text-4xl font-black text-white mb-2`}>
            {project.name}
          </Text>

          <View style={tw`flex-row flex-wrap gap-2 mt-4`}>
            <View style={tw`bg-purple-600/30 px-4 py-1.5 rounded-full border border-purple-500/30`}>
              <Text style={tw`text-purple-300 font-bold text-[10px] uppercase tracking-widest`}>Production Ready</Text>
            </View>
            <View style={tw`bg-emerald-600/30 px-4 py-1.5 rounded-full border border-emerald-500/30`}>
              <Text style={tw`text-emerald-300 font-bold text-[10px] uppercase tracking-widest`}>Verified Case Study</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={tw`flex-1 bg-white/5 rounded-t-[40px] p-8 min-h-[500px] border-t border-white/10`}>
          <Text style={tw`text-purple-400 text-xs font-black mb-3 uppercase tracking-[4px]`}>The Mission</Text>
          <Text style={tw`text-gray-300 text-lg leading-7 mb-10 font-medium`}>
            {project.description}
          </Text>

          <Text style={tw`text-purple-400 text-xs font-black mb-3 uppercase tracking-[4px]`}>Implementation Strategy</Text>
          <Text style={tw`text-gray-400 text-base leading-6 mb-10`}>
            {project.implementation}
          </Text>

          <Text style={tw`text-purple-400 text-xs font-black mb-4 uppercase tracking-[4px]`}>Core Stack</Text>
          <View style={tw`flex-row flex-wrap gap-3 mb-12`}>
            {project.skills.map((skill, index) => (
              <View key={index} style={tw`bg-white/10 px-5 py-3 rounded-2xl border border-white/10`}>
                <Text style={tw`text-white font-bold text-sm`}>{skill}</Text>
              </View>
            ))}
          </View>

          {/* Action Hub */}
          <View style={tw`flex-col gap-4 mb-20`}>
            {project.liveLink && (
              <Pressable
                onPress={() => openLink(project.liveLink)}
                style={tw`bg-emerald-600 py-5 rounded-2xl flex-row items-center justify-center shadow-lg transform active:scale-95 transition-all`}
              >
                <Ionicons name="globe-outline" size={24} color="white" style={tw`mr-3`} />
                <Text style={tw`text-white text-lg font-black uppercase tracking-widest`}>Live Application</Text>
              </Pressable>
            )}

            <View style={tw`flex-row gap-4`}>
              {project.codeLink && (
                <Pressable
                  onPress={() => openLink(project.codeLink)}
                  style={tw`flex-1 bg-gray-800 py-5 rounded-2xl flex-row items-center justify-center border border-white/10 active:opacity-80`}
                >
                  <Ionicons name="logo-github" size={20} color="white" style={tw`mr-2`} />
                  <Text style={tw`text-white text-sm font-bold uppercase`}>Frontend</Text>
                </Pressable>
              )}

              {project.serverCodeLink && (
                <Pressable
                  onPress={() => openLink(project.serverCodeLink)}
                  style={tw`flex-1 bg-slate-900 py-5 rounded-2xl flex-row items-center justify-center border border-white/10 active:opacity-80`}
                >
                  <Ionicons name="server-outline" size={20} color="white" style={tw`mr-2`} />
                  <Text style={tw`text-white text-sm font-bold uppercase`}>Backend</Text>
                </Pressable>
              )}
            </View>

            <Pressable
              onPress={() => router.push("/(tabs)/contact")}
              style={tw`mt-4 bg-white/5 py-4 rounded-xl items-center border border-dashed border-white/20`}
            >
              <Text style={tw`text-gray-400 text-base font-bold`}>Interested in a similar project?</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
