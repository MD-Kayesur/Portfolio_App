import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';

const projects = [
  {
    id: 1,
    title: "E-Commerce App",
    description: "A full-featured shopping platform with shopping cart, real-time stock updates, checkout flow, and Stripe payment integration. Built using React Native and Redux for state management, this app provides a smooth mobile shopping experience.",
    bgColor: "bg-purple-900/40",
    tech: "React Native, Redux, Stripe, Node.js",
    role: "Lead Developer",
    status: "Completed"
  },
  {
    id: 2,
    title: "Social Dashboard",
    description: "Real-time social media analytics and user management system. Features include interactive data visualizations, user activity monitoring, and automated reporting. Built with a focus on high performance and data accuracy.",
    bgColor: "bg-blue-900/40",
    tech: "React, Node.js, Socket.io, D3.js",
    role: "Full Stack Developer",
    status: "In Progress"
  },
  {
    id: 3,
    title: "AI Assistant",
    description: "Intelligent chat application using various NLP models to provide accurate and helpful responses. Features multi-turn conversation support, context awareness, and integration with multiple AI providers.",
    bgColor: "bg-emerald-900/40",
    tech: "Python, FastAPI, OpenAI, LangChain",
    role: "AI Engineer",
    status: "Completed"
  },
  {
    id: 4,
    title: "Task Master",
    description: "Productivity tool with drag-and-drop task management, team collaboration features, and real-time synchronization. Helps teams stay organized and hit their deadlines more effectively.",
    bgColor: "bg-amber-900/40",
    tech: "Vue.js, Firebase, Tailwind CSS",
    role: "Frontend Developer",
    status: "Maintenance"
  },
  {
    id: 5,
    title: "Weather Hub",
    description: "Precise weather forecasting with geolocation, interactive maps, and severe weather alerts. Optimized for speed and low data usage, providing reliable weather info anytime, anywhere.",
    bgColor: "bg-cyan-900/40",
    tech: "React, OpenWeather API, Leaflet",
    role: "Frontend Developer",
    status: "Completed"
  },
];

export default function ProjectDetails() {
  const { id } = useLocalSearchParams();
  const project = projects.find((p) => p.id === Number(id));

  if (!project) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-black`}>
        <Text style={tw`text-xl text-red-500`}>Project not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      {/* Background/Header Overlay */}
      <View style={tw`flex-1`}>
        <View style={tw`p-6 pt-10`}>
          <Pressable
            onPress={() => router.back()}
            style={tw`bg-white/10 p-3 rounded-full self-start mb-8`}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <Text style={tw`text-4xl font-extrabold text-white mb-2`}>
            {project.title}
          </Text>

          <View style={tw`flex-row gap-3 mt-4`}>
            <View style={tw`bg-white/10 px-4 py-1.5 rounded-full border border-white/5`}>
              <Text style={tw`text-white font-medium`}>{project.role}</Text>
            </View>
            <View style={tw`bg-white/10 px-4 py-1.5 rounded-full border border-white/5`}>
              <Text style={tw`text-white font-medium`}>{project.status}</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <ScrollView style={tw`flex-1 bg-black/60 rounded-t-[40px] mt-6 p-8`}>
          <Text style={tw`text-purple-400 text-xl font-bold mb-4 uppercase tracking-wider`}>Overview</Text>
          <Text style={tw`text-white text-lg leading-7 mb-10`}>
            {project.description}
          </Text>

          <Text style={tw`text-purple-400 text-xl font-bold mb-4 uppercase tracking-wider`}>Technologies Used</Text>
          <View style={tw`flex-row flex-wrap gap-3 mb-12`}>
            {project.tech.split(', ').map((t, index) => (
              <View key={index} style={tw`bg-white/5 px-5 py-2.5 rounded-2xl border border-white/10`}>
                <Text style={tw`text-white font-semibold`}>{t}</Text>
              </View>
            ))}
          </View>

          {/* Action Button */}
          <Pressable
            onPress={() => router.push("/(tabs)/contact")}
            style={tw`bg-white py-5 rounded-3xl items-center shadow-xl mb-12`}
          >
            <Text style={tw`text-black text-xl font-black`}>Inquire About This Project</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
