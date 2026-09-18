import React from 'react';
import { View, Text, Image, Platform } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

export default function WhatMovesAppSection() {
  const architecturalLayers = [
    {
      badge: "FRONTEND ENGINE",
      badgeColor: "#38bdf8",
      title: "60 FPS Reactive UI & Glassmorphism",
      description: "Powered by React Native with twrnc Tailwind design tokens, Animated interpolation for scroll-aware navigation, and dynamic frosted glass blur views.",
      techs: ["React Native", "Expo Router", "Tailwind CSS", "Expo-Blur"]
    },
    {
      badge: "MEDIA & SOUND ENGINE",
      badgeColor: "#c084fc",
      title: "Audio Synthesis & Document Pipeline",
      description: "Custom zero-latency Web Audio API synthesizer on web paired with an expo-av native audio pool on mobile for tactile mechanical keyboard feedback.",
      techs: ["Web Audio API", "Expo-AV", "Expo-FileSystem", "Expo-Sharing"]
    },
    {
      badge: "FULL-STACK CLOUD",
      badgeColor: "#34d399",
      title: "Real-Time REST APIs & Redux Toolkit",
      description: "Connected to a live Node.js/Express backend deployed on Vercel with MongoDB databases and RTK Query automated cache synchronization.",
      techs: ["Redux Toolkit", "RTK Query", "Node.js / Express", "MongoDB"]
    }
  ];

  return (
    <View style={tw`w-full mt-14 px-6`}>
      {/* Section Header */}
      <View style={tw`items-center mb-8`}>
        <View style={tw`flex-row items-center bg-cyan-600/15 border border-cyan-500/30 px-3.5 py-1.5 rounded-full mb-3`}>
          <Ionicons name="hardware-chip" size={14} color="#38bdf8" style={tw`mr-1.5`} />
          <Text style={tw`text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest`}>
            Under The Hood
          </Text>
        </View>

        <Text style={tw`text-3xl md:text-4xl font-black text-white text-center mb-3 leading-tight`}>
          What Moves This App
        </Text>
        
        <Text style={tw`text-gray-400 text-center text-sm md:text-base max-w-xl leading-6`}>
          An inside look at the technical stack, architectural decisions, and design systems powering this application.
        </Text>
      </View>

      {/* Visual Tech Graphic Banner */}
      <View style={tw`rounded-3xl border border-white/15 bg-white/5 overflow-hidden mb-8 shadow-2xl`}>
        <Image
          source={require('@/assets/images/fullstack_engine.jpg')}
          style={tw`w-full h-56 md:h-72`}
          resizeMode="cover"
        />

        <View style={tw`p-6 bg-black/40`}>
          <Text style={tw`text-white text-xl font-bold mb-2`}>
            Full-Stack & Mobile Synchronization
          </Text>
          <Text style={tw`text-gray-300 text-sm leading-6`}>
            From frontend state management to cloud database persistence, every component is architected for maximum responsiveness and high reliability.
          </Text>
        </View>
      </View>

      {/* Layer Cards */}
      <View style={tw`gap-4`}>
        {architecturalLayers.map((layer, index) => (
          <View
            key={index}
            style={tw`rounded-3xl p-6 border border-white/10 bg-white/5 relative overflow-hidden`}
          >
            {/* Top color bar */}
            <View style={[tw`absolute top-0 left-0 right-0 h-1`, { backgroundColor: layer.badgeColor }]} />

            <View style={tw`flex-row items-center justify-between mb-3`}>
              <View style={[tw`px-3 py-1 rounded-full`, { backgroundColor: `${layer.badgeColor}20` }]}>
                <Text style={[tw`text-xs font-mono font-bold tracking-wider`, { color: layer.badgeColor }]}>
                  {layer.badge}
                </Text>
              </View>
              <Text style={tw`text-gray-500 font-mono text-xs`}>
                0{index + 1}
              </Text>
            </View>

            <Text style={tw`text-white text-xl font-bold mb-2`}>
              {layer.title}
            </Text>

            <Text style={tw`text-gray-300 text-sm leading-6 mb-4`}>
              {layer.description}
            </Text>

            {/* Tech Badges */}
            <View style={tw`flex-row flex-wrap gap-2 pt-2 border-t border-white/10`}>
              {layer.techs.map((tech, tIdx) => (
                <View key={tIdx} style={tw`bg-white/10 px-3 py-1 rounded-lg border border-white/10`}>
                  <Text style={tw`text-gray-300 text-xs font-mono`}>
                    {tech}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
