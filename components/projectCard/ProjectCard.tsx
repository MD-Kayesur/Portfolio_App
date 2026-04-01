import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import projectsData from '@/utils/projectsData.json';
import tw from 'twrnc';

interface Project {
  id: string;
  name: string;
  description: string;
  skills: string[];
  implementation: string;
  liveLink: string;
  codeLink: string;
  serverCodeLink: string;
  image: string;
}

export default function ProjectCard() {
  const projects = projectsData as Project[];

  return (
    <View style={tw`w-full`}>
      {/* Header */}
      <View style={tw`items-center mb-10`}>
        <Text style={tw`text-3xl font-black text-white mb-2`}>
          Professional Portfolio
        </Text>
        <Text style={tw`text-gray-400 text-center text-sm px-6 leading-5`}>
          A curated selection of my most significant technical achievements and engineering projects.
        </Text>
      </View>

      {/* Project Cards */}
      {projects.map((project) => (
        <View
          key={project.id}
          style={tw`rounded-3xl p-6 mb-8 border border-white/10 bg-white/5 overflow-hidden`}
        >
          {/* Subtle Accent Line */}
          <View style={tw`absolute top-0 left-0 right-0 h-1 bg-purple-600/50`} />

          <View style={tw`mb-4`}>
            <Text style={tw`text-white text-2xl font-black mb-3`}>
              {project.name}
            </Text>
            <Text style={tw`text-gray-400 text-base leading-6 mb-4`}>
              {project.description}
            </Text>
          </View>

          <View style={tw`flex-row flex-wrap gap-2 mb-8`}>
            {project.skills.slice(0, 3).map((skill, index) => (
              <View key={index} style={tw`bg-purple-600/10 px-3 py-1.5 rounded-xl border border-purple-500/20`}>
                <Text style={tw`text-purple-400 text-[10px] font-black uppercase tracking-widest`}>
                  {skill}
                </Text>
              </View>
            ))}
            {project.skills.length > 3 && (
              <View style={tw`bg-white/5 px-3 py-1.5 rounded-xl border border-white/5`}>
                <Text style={tw`text-gray-500 text-[10px] font-bold uppercase`}>
                  +{project.skills.length - 3} More
                </Text>
              </View>
            )}
          </View>

          <Link href={`/projects/${project.id}`} asChild>
            <Pressable
              style={({ pressed }) => [
                tw`bg-white py-4 rounded-2xl items-center shadow-xl`,
                pressed && tw`opacity-90 scale-[0.98]`
              ]}
            >
              <Text style={tw`text-black font-black text-sm uppercase tracking-widest`}>
                Explore Case Study
              </Text>
            </Pressable>
          </Link>
        </View>
      ))}
    </View>
  );
}
