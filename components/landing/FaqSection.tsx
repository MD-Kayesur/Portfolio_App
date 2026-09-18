import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { playTypingSound } from '@/utils/typingSound';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tag: string;
}

const faqsData: FaqItem[] = [
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

interface FaqCardProps {
  faq: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqCard({ faq, isOpen, onToggle }: FaqCardProps) {
  const isWeb = Platform.OS === 'web';
  const anim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const [measuredHeight, setMeasuredHeight] = useState<number>(120);

  useEffect(() => {
    if (!isWeb) {
      Animated.timing(anim, {
        toValue: isOpen ? 1 : 0,
        duration: 280,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }).start();
    }
  }, [isOpen, isWeb]);

  const arrowRotation = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const nativeHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, measuredHeight],
  });

  const nativeOpacity = anim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.4, 1],
  });

  return (
    <View
      style={[
        tw`rounded-3xl border overflow-hidden`,
        isOpen
          ? tw`border-purple-500/60 bg-white/10 shadow-2xl`
          : tw`border-white/10 bg-white/5`,
        isWeb && ({
          transition: 'border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
        } as any),
      ]}
    >
      {/* Question Header (Always Visible & Statically Sized) */}
      <TouchableOpacity
        onPress={() => {
          playTypingSound();
          onToggle();
        }}
        activeOpacity={0.8}
        style={[
          tw`p-5 flex-row items-center justify-between`,
          isWeb && ({ cursor: 'pointer', userSelect: 'none' } as any),
        ]}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
      >
        <View style={tw`flex-1 pr-3`}>
          <Text style={tw`text-purple-400 font-mono text-[10px] font-bold tracking-widest uppercase mb-1`}>
            {faq.tag}
          </Text>
          <Text style={tw`text-white font-bold text-base leading-6`}>
            {faq.question}
          </Text>
        </View>

        {/* Rotating Chevron Icon Button */}
        {isWeb ? (
          <View
            style={[
              tw`w-9 h-9 rounded-full items-center justify-center border shadow-md`,
              isOpen
                ? tw`bg-purple-600 border-purple-400`
                : tw`bg-white/10 border-white/15`,
              {
                transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), background-color 0.3s ease, border-color 0.3s ease',
              } as any,
            ]}
          >
            <Ionicons
              name="chevron-down"
              size={18}
              color="white"
            />
          </View>
        ) : (
          <Animated.View
            style={[
              tw`w-9 h-9 rounded-full items-center justify-center border shadow-md`,
              isOpen
                ? tw`bg-purple-600 border-purple-400`
                : tw`bg-white/10 border-white/15`,
              { transform: [{ rotate: arrowRotation }] }
            ]}
          >
            <Ionicons
              name="chevron-down"
              size={18}
              color="white"
            />
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* Butter-Smooth Collapsible Answer (Zero Jump / No Layout Thrashing) */}
      {isWeb ? (
        <View
          style={[
            {
              display: 'grid',
              gridTemplateRows: isOpen ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
            } as any,
          ]}
        >
          <View style={{ minHeight: 0, overflow: 'hidden' }}>
            <View
              style={[
                tw`px-5 pb-5 pt-2 border-t border-white/10`,
                {
                  opacity: isOpen ? 1 : 0,
                  transition: 'opacity 0.25s ease-in-out',
                } as any,
              ]}
            >
              <Text style={tw`text-gray-300 text-sm leading-6`}>
                {faq.answer}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Animated.View
          style={{
            height: nativeHeight,
            opacity: nativeOpacity,
            overflow: 'hidden',
          }}
        >
          <View
            onLayout={(e) => {
              const h = e.nativeEvent.layout.height;
              if (h > 0 && Math.abs(h - measuredHeight) > 1) {
                setMeasuredHeight(h);
              }
            }}
            style={tw`px-5 pb-5 pt-2 border-t border-white/10`}
          >
            <Text style={tw`text-gray-300 text-sm leading-6`}>
              {faq.answer}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

export default function FaqSection() {
  const router = useRouter();
  // Independent open state: opening one FAQ does NOT collapse or jerk others above/below it
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const toggleFaq = (id: string) => {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
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

      {/* Animated FAQ List */}
      <View style={tw`gap-3.5`}>
        {faqsData.map((faq) => (
          <FaqCard
            key={faq.id}
            faq={faq}
            isOpen={!!openIds[faq.id]}
            onToggle={() => toggleFaq(faq.id)}
          />
        ))}
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
