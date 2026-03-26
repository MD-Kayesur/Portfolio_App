import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import tw from 'twrnc';

export default function ProjectCard() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce App",
      description:
        "A full-featured shopping platform with cart, checkout, and payments.",
      bgColor: "bg-purple-900/40",
      tech: "React Native, Redux, Stripe",
    },
    {
      id: 2,
      title: "Social Dashboard",
      description:
        "Real-time social media analytics and user management system.",
      bgColor: "bg-blue-900/40",
      tech: "React, Node.js, Socket.io",
    },
    {
      id: 3,
      title: "AI Assistant",
      description:
        "Intelligent chat application using various NLP models.",
      bgColor: "bg-emerald-900/40",
      tech: "Python, FastAPI, OpenAI",
    },
    {
      id: 4,
      title: "Task Master",
      description: "Productivity tool with drag-and-drop task management.",
      bgColor: "bg-amber-900/40",
      tech: "Vue.js, Firebase",
    },
    {
      id: 5,
      title: "Weather Hub",
      description:
        "Precise weather forecasting with geolocation and maps integration.",
      bgColor: "bg-cyan-900/40",
      tech: "React, OpenWeather API",
    },
  ];

  return (
    <View style={tw`w-full`}>
      {/* Header */}
      <Text style={tw`text-3xl font-extrabold text-white mb-2 text-center`}>
        My Projects
      </Text>
      <Text style={tw`text-gray-400 text-center mb-10 text-base`}>
        A showcase of my latest work and achievements.
      </Text>

      {/* Project Cards */}
      {projects.map((project) => (
        <View
          key={project.id}
          style={tw`${project.bgColor} rounded-3xl p-6 mb-6 border border-white/10`}
        >
          <View style={tw`mb-4`}>
            <Text style={tw`text-white text-2xl font-bold mb-2`}>
              {project.title}
            </Text>
            <Text style={tw`text-gray-300 text-base leading-6`}>
              {project.description}
            </Text>
          </View>

          <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
            <View style={tw`bg-white/10 px-3 py-1 rounded-full border border-white/5`}>
              <Text style={tw`text-white text-xs`}>{project.tech}</Text>
            </View>
          </View>

          <Link href={`/projects/${project.id}`} asChild>
            <Pressable style={tw`bg-white py-4 rounded-xl items-center`}>
              <Text style={tw`text-black font-bold text-lg`}>
                View Details
              </Text>
            </Pressable>
          </Link>
        </View>
      ))}
    </View>
  );
}
