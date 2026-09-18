import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DeveloperRolesSection() {
  const router = useRouter();

  const roles = [
    {
      role: "Frontend Developer",
      badgeColor: "#38bdf8",
      icon: "desktop-outline",
      tagline: "Pixel-Perfect, Accessible & Modern Interfaces",
      points: [
        "Modern component-driven architecture with React and TypeScript",
        "Responsive, mobile-first design using Tailwind CSS and glassmorphism",
        "Fast load times, micro-animations, and fluid UX transitions"
      ],
      tags: ["React.js", "TypeScript", "Tailwind CSS", "Vite", "UI/UX"]
    },
    {
      role: "App Developer",
      badgeColor: "#c084fc",
      icon: "phone-portrait-outline",
      tagline: "High-Performance Cross-Platform Mobile Apps",
      points: [
        "Native Android & iOS applications using React Native and Expo SDK 54",
        "Device hardware integration: Audio synthesis, camera, filesystem, and sharing",
        "Smooth gesture handling and 60 FPS animated user flows"
      ],
      tags: ["React Native", "Expo SDK", "Mobile UI", "Audio Synthesis", "EAS Build"]
    },
    {
      role: "Full Stack Developer",
      badgeColor: "#34d399",
      icon: "server-outline",
      tagline: "Robust End-to-End Architecture & Scalable APIs",
      points: [
        "RESTful API design and implementation with Node.js and Express",
        "MongoDB schema architecture and cloud data persistence",
        "Automated state caching and live synchronization via RTK Query"
      ],
      tags: ["Node.js", "Express.js", "MongoDB", "REST APIs", "RTK Query"]
    }
  ];

  return (
    <View style={tw`w-full mt-14 px-6`}>
      {/* Section Header */}
      <View style={tw`items-center mb-8`}>
        <View style={tw`flex-row items-center bg-emerald-600/15 border border-emerald-500/30 px-3.5 py-1.5 rounded-full mb-3`}>
          <Ionicons name="code-slash" size={14} color="#34d399" style={tw`mr-1.5`} />
          <Text style={tw`text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest`}>
            Engineering Disciplines
          </Text>
        </View>

        <Text style={tw`text-3xl md:text-4xl font-black text-white text-center mb-3 leading-tight`}>
          Frontend, App & Full Stack
        </Text>
        
        <Text style={tw`text-gray-400 text-center text-sm md:text-base max-w-xl leading-6`}>
          Three unified skillsets working together to deliver cohesive, performant, and reliable digital products.
        </Text>
      </View>

      {/* Role Cards */}
      <View style={tw`gap-6`}>
        {roles.map((item, index) => (
          <View
            key={index}
            style={tw`rounded-3xl p-6 border border-white/10 bg-white/5 relative overflow-hidden shadow-xl`}
          >
            {/* Top Accent Line */}
            <View style={[tw`absolute top-0 left-0 right-0 h-1`, { backgroundColor: item.badgeColor }]} />

            {/* Header */}
            <View style={tw`flex-row items-center mb-4`}>
              <View style={[tw`w-12 h-12 rounded-2xl items-center justify-center mr-4 shadow-lg`, { backgroundColor: `${item.badgeColor}25`, borderColor: `${item.badgeColor}40`, borderWidth: 1 }]}>
                <Ionicons name={item.icon as any} size={24} color={item.badgeColor} />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white text-xl font-bold`}>
                  {item.role}
                </Text>
                <Text style={[tw`text-xs font-mono mt-0.5`, { color: item.badgeColor }]}>
                  {item.tagline}
                </Text>
              </View>
            </View>

            {/* Bullet Points */}
            <View style={tw`gap-2.5 mb-5`}>
              {item.points.map((point, pIdx) => (
                <View key={pIdx} style={tw`flex-row items-start`}>
                  <Ionicons name="checkmark-circle" size={16} color={item.badgeColor} style={tw`mr-2 mt-0.5`} />
                  <Text style={tw`text-gray-300 text-sm leading-5 flex-1`}>
                    {point}
                  </Text>
                </View>
              ))}
            </View>

            {/* Tech Pill List */}
            <View style={tw`flex-row flex-wrap gap-2 pt-3 border-t border-white/10`}>
              {item.tags.map((tag, tIdx) => (
                <View key={tIdx} style={tw`bg-black/30 px-2.5 py-1 rounded-lg border border-white/10`}>
                  <Text style={tw`text-gray-300 text-xs font-mono`}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Button Row */}
      <View style={tw`flex-row gap-3 mt-6`}>
        <TouchableOpacity
          onPress={() => router.push('/projects')}
          style={tw`flex-1 bg-purple-600 py-3.5 px-4 rounded-2xl flex-row items-center justify-center shadow-lg active:bg-purple-700`}
          activeOpacity={0.8}
        >
          <Ionicons name="grid-outline" size={18} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white font-bold font-mono text-sm`}>
            Explore Projects
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/skills')}
          style={tw`flex-1 bg-white/10 border border-white/15 py-3.5 px-4 rounded-2xl flex-row items-center justify-center active:bg-white/20`}
          activeOpacity={0.8}
        >
          <Ionicons name="hardware-chip-outline" size={18} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white font-bold font-mono text-sm`}>
            View Skills
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
