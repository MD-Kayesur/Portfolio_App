import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function WhyCreatedSection() {
  const router = useRouter();

  const reasons = [
    {
      icon: "phone-portrait-outline",
      iconColor: "#38bdf8",
      title: "Beyond Static Resumes",
      desc: "Traditional PDFs are flat and passive. I built this app so recruiters and clients can actually experience my code, animations, sound design, and mobile UX in real-time."
    },
    {
      icon: "layers-outline",
      iconColor: "#c084fc",
      title: "Real Production Architecture",
      desc: "Demonstrating clean state management with Redux Toolkit, live REST APIs, zero-latency Web Audio & native audio pooling, and secure dashboard authentication."
    },
    {
      icon: "hardware-chip-outline",
      iconColor: "#34d399",
      title: "Cross-Platform Mastery",
      desc: "One unified TypeScript codebase running seamlessly across native Android, iOS, and responsive Web with 60 FPS fluidity."
    }
  ];

  return (
    <View style={tw`w-full mt-14 px-6`}>
      {/* Section Badge & Title */}
      <View style={tw`items-center mb-8`}>
        <View style={tw`flex-row items-center bg-purple-600/15 border border-purple-500/30 px-3.5 py-1.5 rounded-full mb-3`}>
          <Ionicons name="sparkles" size={14} color="#c084fc" style={tw`mr-1.5`} />
          <Text style={tw`text-purple-400 text-xs font-mono font-bold uppercase tracking-widest`}>
            Vision & Motivation
          </Text>
        </View>

        <Text style={tw`text-3xl md:text-4xl font-black text-white text-center mb-3 leading-tight`}>
          Why I Created This App
        </Text>
        
        <Text style={tw`text-gray-400 text-center text-sm md:text-base max-w-xl leading-6`}>
          A portfolio should be more than a document—it should be living proof of technical craft, user empathy, and end-to-end engineering excellence.
        </Text>
      </View>

      {/* Hero Visual Card */}
      <View style={tw`rounded-3xl border border-white/15 bg-white/5 overflow-hidden mb-8 shadow-2xl`}>
        <Image
          source={require('@/assets/images/app_vision_banner.jpg')}
          style={tw`w-full h-56 md:h-72`}
          resizeMode="cover"
        />
        
        <View style={tw`p-6 bg-black/40`}>
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <Text style={tw`text-purple-400 font-mono text-xs uppercase tracking-widest font-bold`}>
              Interactive Portfolio Philosophy
            </Text>
            <View style={tw`flex-row items-center bg-emerald-500/20 px-2 py-0.5 rounded-full`}>
              <View style={tw`w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5`} />
              <Text style={tw`text-emerald-400 text-[10px] font-mono font-bold`}>LIVE NATIVE & WEB</Text>
            </View>
          </View>

          <Text style={tw`text-white text-xl font-bold mb-2`}>
            Code Speaks Louder Than Words
          </Text>
          <Text style={tw`text-gray-300 text-sm leading-6`}>
            When you interact with this app—from the haptic typing audio to the blurred glassmorphic admin dashboard—you are testing production code engineered from scratch.
          </Text>
        </View>
      </View>

      {/* Feature Pillar Cards */}
      <View style={tw`gap-4`}>
        {reasons.map((item, index) => (
          <View
            key={index}
            style={tw`rounded-2xl p-5 border border-white/10 bg-white/5 flex-row items-start`}
          >
            <View style={tw`w-11 h-11 rounded-2xl bg-white/10 border border-white/15 items-center justify-center mr-4 mt-0.5 shadow-md`}>
              <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white text-lg font-bold mb-1.5`}>
                {item.title}
              </Text>
              <Text style={tw`text-gray-400 text-sm leading-5`}>
                {item.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Action Prompt */}
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/about')}
        style={tw`mt-6 bg-purple-600/20 border border-purple-500/30 py-3.5 px-6 rounded-2xl flex-row items-center justify-center active:bg-purple-600/40`}
        activeOpacity={0.7}
      >
        <Text style={tw`text-purple-300 font-bold font-mono text-sm mr-2`}>
          Learn More About My Journey
        </Text>
        <Ionicons name="arrow-forward" size={16} color="#c084fc" />
      </TouchableOpacity>
    </View>
  );
}
