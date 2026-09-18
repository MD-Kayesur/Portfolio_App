import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tag: string;
}

export default function FaqSection() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>("faq_1");

  const faqs: FaqItem[] = [
    {
      id: "faq_1",
      tag: "AVAILABILITY",
      question: "Are you available for Full-Time, Contract, or Remote roles?",
      answer: "Yes! I am actively seeking full-time opportunities, contract roles, and remote positions as a Full Stack Developer, Mobile App Developer, or Frontend Developer. I can quickly adapt to existing teams or build new products from scratch."
    },
    {
      id: "faq_2",
      tag: "TECH STACK",
      question: "What technologies do you specialize in?",
      answer: "My core stack centers around React Native, Expo, React.js, TypeScript, and Tailwind CSS on the frontend/mobile side, and Node.js, Express.js, MongoDB, RESTful APIs, and Redux Toolkit on the backend. I focus on writing scalable, clean, and maintainable code."
    },
    {
      id: "faq_3",
      tag: "MOBILE DEV",
      question: "Can you publish and maintain apps for both iOS & Android?",
      answer: "Yes. Leveraging Expo EAS Build and React Native, I develop cross-platform mobile apps with native device capabilities (camera, audio synthesis, file system caching, and sharing) and prepare them for both Google Play Store and Apple App Store."
    },
    {
      id: "faq_4",
      tag: "PORTFOLIO APP",
      question: "Why did you build this portfolio as an Expo mobile app?",
      answer: "Traditional resumes don't showcase real-time tactile capabilities. By building this app, visitors can test actual production features—including instant typing sound feedback, dynamic blur cards, and live API integrations—first-hand."
    },
    {
      id: "faq_5",
      tag: "COLLABORATION",
      question: "How can we start working together or discuss a project?",
      answer: "You can download my CV from the top-right button, send me a quick message via WhatsApp in the bottom navigation bar, or use the in-app Contact form. I typically respond within a few hours!"
    }
  ];

  const toggleFaq = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={tw`w-full mt-14 px-6 mb-16`}>
      {/* Section Header */}
      <View style={tw`items-center mb-8`}>
        <View style={tw`flex-row items-center bg-amber-500/15 border border-amber-500/30 px-3.5 py-1.5 rounded-full mb-3`}>
          <Ionicons name="help-circle" size={14} color="#f59e0b" style={tw`mr-1.5`} />
          <Text style={tw`text-amber-400 text-xs font-mono font-bold uppercase tracking-widest`}>
            Got Questions?
          </Text>
        </View>

        <Text style={tw`text-3xl md:text-4xl font-black text-white text-center mb-3 leading-tight`}>
          Frequently Asked Questions
        </Text>
        
        <Text style={tw`text-gray-400 text-center text-sm md:text-base max-w-xl leading-6`}>
          Quick answers about my background, technical capabilities, availability, and development process.
        </Text>
      </View>

      {/* FAQ Accordion List */}
      <View style={tw`gap-3.5`}>
        {faqs.map((faq) => {
          const isOpen = expandedId === faq.id;

          return (
            <TouchableOpacity
              key={faq.id}
              onPress={() => toggleFaq(faq.id)}
              activeOpacity={0.85}
              style={[
                tw`rounded-3xl border overflow-hidden transition-all duration-200`,
                isOpen 
                  ? tw`border-purple-500/50 bg-white/10 shadow-xl` 
                  : tw`border-white/10 bg-white/5`
              ]}
            >
              {/* Question Header */}
              <View style={tw`p-5 flex-row items-center justify-between`}>
                <View style={tw`flex-1 pr-3`}>
                  <Text style={tw`text-purple-400 font-mono text-[10px] font-bold tracking-widest uppercase mb-1`}>
                    {faq.tag}
                  </Text>
                  <Text style={tw`text-white font-bold text-base leading-6`}>
                    {faq.question}
                  </Text>
                </View>

                {/* Arrow Icon */}
                <View style={[
                  tw`w-8 h-8 rounded-full items-center justify-center border`,
                  isOpen 
                    ? tw`bg-purple-600 border-purple-400` 
                    : tw`bg-white/10 border-white/15`
                ]}>
                  <Ionicons 
                    name={isOpen ? "chevron-up" : "chevron-down"} 
                    size={18} 
                    color="white" 
                  />
                </View>
              </View>

              {/* Collapsible Answer */}
              {isOpen && (
                <View style={tw`px-5 pb-5 pt-1 border-t border-white/10`}>
                  <Text style={tw`text-gray-300 text-sm leading-6`}>
                    {faq.answer}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* CTA Box */}
      <View style={tw`mt-8 rounded-3xl p-6 border border-purple-500/30 bg-purple-950/30 relative overflow-hidden shadow-2xl`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-1 pr-4`}>
            <Text style={tw`text-white text-lg font-bold mb-1`}>
              Have a different question?
            </Text>
            <Text style={tw`text-gray-400 text-xs leading-5`}>
              Reach out directly and let's talk about how I can contribute to your project or company.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/contact')}
            style={tw`bg-purple-600 px-4 py-3 rounded-2xl flex-row items-center shadow-lg active:bg-purple-700`}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-ellipses" size={16} color="white" style={tw`mr-1.5`} />
            <Text style={tw`text-white font-bold font-mono text-xs`}>
              Get in Touch
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
