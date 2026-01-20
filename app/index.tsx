import { useState, useEffect } from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Platform,
  StatusBar,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import SafeScreen from "@/components/SafeScreen";
import tw from 'twrnc';

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi 👋 I am your portfolio assistant. Ask me about my projects, skills, or contact info!",
    },
  ]);
  const [activeTab, setActiveTab] = useState<"home" | "chat">("home");

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/(tabs)");
    } else {
      router.push("/(auth)/sign-in");
    }
  };

  const pageIcons = [
    { icon: "log-in" as keyof typeof Ionicons.glyphMap, route: "/(auth)/sign-in", label: "Sign In", path: "/sign-in" },
    { icon: "logo-whatsapp" as keyof typeof Ionicons.glyphMap, route: "/whatsapp", label: "WhatsApp", path: "/whatsapp" },
    { icon: "home" as keyof typeof Ionicons.glyphMap, route: "/(tabs)", label: "Home", path: "/(tabs)" },
    { icon: "cube" as keyof typeof Ionicons.glyphMap, route: "/cube", label: "Cube", path: "/cube" },
    { icon: "book-outline" as keyof typeof Ionicons.glyphMap, route: "/blogs", label: "Blogs", path: "/blogs" },
    { icon: "chatbubble-ellipses" as keyof typeof Ionicons.glyphMap, route: "/chat", label: "AI Chat", path: "/chat" },
  ];

  const quickButtons = [
    { label: "About Me", query: "Tell me about the creator" },
    { label: "Projects", query: "What projects have you built?" },
    { label: "Skills", query: "What technologies do you know?" },
    { label: "Contact", query: "How can I contact you?" },
  ];

  const getAssistantReply = (userText: string) => {
    const text = userText.toLowerCase();

    if (text.includes("who are you") || text.includes("creator"))
      return "I'm MD_Kayesur, a full-stack developer specializing in React Native, Expo, and modern web technologies.";

    if (text.includes("what do you do") || text.includes("skills"))
      return "I build mobile apps with React Native/Expo, web apps with Next.js, and backend APIs with Node.js. I'm skilled in TypeScript, Tailwind CSS, and cloud deployment.";

    if (text.includes("project") || text.includes("build"))
      return "I've built fitness apps, portfolio websites, e-commerce platforms, and AI chatbots. Check out my GitHub for more!";

    if (text.includes("contact") || text.includes("reach"))
      return "You can contact me via LinkedIn, GitHub, or email. Find all links in my portfolio!";

    if (text.includes("experience"))
      return "I have experience in full-stack development, UI/UX design, and mobile app development with React Native.";

    return "That's interesting! Ask me about my projects, skills, experience, or how to contact me! 😊";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    const assistantMessage: Message = {
      role: "assistant",
      text: getAssistantReply(input),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
  };

  const handleQuickButton = (query: string) => {
    setInput(query);
    setTimeout(() => handleSend(), 100);
  };

  const handleIconPress = (route: string, label: string) => {
    setActiveIcon(label);
    if (label === "AI Chat") {
      setActiveTab("chat");
    } else {
      router.push(route as any);
    }
  };

  const isActive = (page: typeof pageIcons[0]) => {
    if (activeIcon) {
      return activeIcon === page.label;
    }
    return pathname.includes(page.path) || (page.path === "/(tabs)" && pathname === "/");
  };

  return (
    <SafeScreen>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Main Content */}
      <View style={tw`flex-1 bg-white`}>
        {/* Top Navigation Tabs */}
        <View style={tw`flex-row border-b border-gray-200`}>
          <Pressable
            onPress={() => setActiveTab("home")}
            style={tw`flex-1 py-4 items-center ${activeTab === "home" ? "border-b-2 border-red-600" : ""}`}
          >
            <Text style={tw`font-semibold ${activeTab === "home" ? "text-red-600" : "text-gray-500"}`}>
              Portfolio
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("chat")}
            style={tw`flex-1 py-4 items-center ${activeTab === "chat" ? "border-b-2 border-red-600" : ""}`}
          >
            <Text style={tw`font-semibold ${activeTab === "chat" ? "text-red-600" : "text-gray-500"}`}>
              AI Assistant
            </Text>
          </Pressable>
        </View>

        {activeTab === "home" ? (
          <>
            {/* Home Tab Content */}
            <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
              <View style={tw`items-center justify-center px-6 py-10`}>
                
                {/* App Logo/Icon */}
                <View style={tw`mb-8`}>
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    style={tw`w-32 h-32 rounded-full items-center justify-center mx-auto mb-6`}
                  >
                    <Ionicons name="code-slash" size={64} color="white" />
                  </LinearGradient>
                </View>

                {/* Welcome Text */}
                <Text style={tw`text-4xl font-bold text-gray-900 text-center mb-2`}>
                  Welcome to my Portfolio
                </Text>
                
                <Text style={tw`text-3xl font-bold text-red-600 text-center mb-6`}>
                  MD_Kayesur
                </Text>

                {/* Description */}
                <Text style={tw`text-lg text-gray-600 text-center leading-relaxed mb-10 max-w-lg`}>
                  Full-Stack Developer specializing in React Native, Expo, and modern web technologies. 
                  Building beautiful, performant apps with great user experiences.
                </Text>

                {/* Get Started Button */}
                <Pressable 
                  onPress={handleGetStarted}
                  style={({ pressed }) => [
                    tw`bg-gradient-to-r from-red-600 to-orange-500 px-12 py-4 rounded-full shadow-lg`,
                    pressed && tw`opacity-90`
                  ]}
                >
                  <View style={tw`flex-row items-center`}>
                    <Ionicons name="rocket" size={20} color="white" style={tw`mr-2`} />
                    <Text style={tw`text-white font-bold text-lg`}>
                      GET STARTED NOW
                    </Text>
                  </View>
                </Pressable>

                {/* Features Grid */}
                <View style={tw`flex-row flex-wrap justify-center mt-12 gap-6 max-w-2xl`}>
                  {[
                    { icon: "phone-portrait", label: "Mobile Apps", color: "#3B82F6" },
                    { icon: "globe", label: "Web Apps", color: "#10B981" },
                    { icon: "brush", label: "UI/UX Design", color: "#8B5CF6" },
                    { icon: "cloud", label: "Cloud & APIs", color: "#F59E0B" }
                  ].map((feature, index) => (
                    <View key={index} style={tw`items-center p-5`}>
                      <View style={[tw`w-20 h-20 rounded-full items-center justify-center mb-3`, { backgroundColor: `${feature.color}20` }]}>
                        <Ionicons name={feature.icon as any} size={32} color={feature.color} />
                      </View>
                      <Text style={tw`text-gray-800 font-semibold`}>{feature.label}</Text>
                    </View>
                  ))}
                </View>

                {/* Quick Links */}
                <View style={tw`mt-12 w-full max-w-lg`}>
                  <Text style={tw`text-xl font-bold text-gray-900 text-center mb-6`}>
                    Quick Links
                  </Text>
                  <View style={tw`flex-row flex-wrap justify-center gap-4`}>
                    {quickButtons.map((button, index) => (
                      <Pressable
                        key={index}
                        onPress={() => handleQuickButton(button.query)}
                        style={({ pressed }) => [
                          tw`px-6 py-3 rounded-full border border-gray-300`,
                          pressed && tw`bg-gray-100`
                        ]}
                      >
                        <Text style={tw`text-gray-700 font-medium`}>{button.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          </>
        ) : (
          <>
            {/* AI Assistant Tab Content */}
            <LinearGradient
              colors={["#4f46e5", "#6d28d9", "#9333ea"]}
              style={tw`flex-1`}
            >
              {/* Header */}
              <View style={tw`px-6 pt-8 pb-4`}>
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="sparkles" size={24} color="white" style={tw`mr-3`} />
                  <View>
                    <Text style={tw`text-white text-2xl font-bold`}>
                      Portfolio Assistant
                    </Text>
                    <Text style={tw`text-white/80 mt-1`}>
                      Ask me about projects, skills, or experience
                    </Text>
                  </View>
                </View>
              </View>

              {/* Chat Area */}
              <ScrollView
                style={tw`flex-1 px-6`}
                contentContainerStyle={tw`pb-6`}
                showsVerticalScrollIndicator={false}
              >
                {messages.map((msg, index) => (
                  <View
                    key={index}
                    style={[
                      tw`mb-4 max-w-[85%] px-4 py-3 rounded-2xl`,
                      msg.role === "user"
                        ? tw`bg-black/30 self-end rounded-tr-none`
                        : tw`bg-white/20 self-start rounded-tl-none`,
                    ]}
                  >
                    <Text style={tw`text-white`}>
                      {msg.text}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Quick Action Buttons */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={tw`px-4 py-3`}
                contentContainerStyle={tw`gap-3`}
              >
                {quickButtons.map((button, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleQuickButton(button.query)}
                    style={tw`px-4 py-2 bg-white/20 rounded-full`}
                  >
                    <Text style={tw`text-white text-sm`}>{button.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              {/* Input Area */}
              <View style={tw`px-4 pb-6 pt-3`}>
                <View style={tw`flex-row items-center bg-white/20 rounded-full px-4`}>
                  <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Ask something..."
                    placeholderTextColor="#e5e7eb"
                    style={tw`flex-1 text-white py-3`}
                    onSubmitEditing={handleSend}
                  />
                  <Pressable onPress={handleSend} style={tw`p-2`}>
                    <Ionicons name="send" size={24} color="white" />
                  </Pressable>
                </View>
              </View>
            </LinearGradient>
          </>
        )}

        {/* Bottom Navigation */}
        <View style={tw`border-t border-gray-200 py-3 ${Platform.OS === 'web' ? 'px-8' : 'px-4'}`}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`items-center justify-between ${Platform.OS === 'web' ? 'gap-8' : 'gap-4'} w-full`}
          >
            {pageIcons.map((page, index) => (
              <Pressable
                key={index}
                onPress={() => handleIconPress(page.route, page.label)}
                style={({ pressed }) => [
                  tw`items-center ${Platform.OS === 'web' ? 'px-3' : 'px-2'}`,
                  pressed && tw`opacity-70`
                ]}
              >
                <View style={[
                  tw`${Platform.OS === 'web' ? 'w-16 h-16' : 'w-12 h-12'} rounded-full items-center justify-center mb-2`,
                  (isActive(page) || (page.label === "AI Chat" && activeTab === "chat")) 
                    ? tw`bg-red-100` 
                    : tw`bg-gray-100`
                ]}>
                  <Ionicons
                    name={page.icon}
                    size={Platform.OS === 'web' ? 28 : 22}
                    color={
                      (isActive(page) || (page.label === "AI Chat" && activeTab === "chat")) 
                        ? "#dc2626" 
                        : "#6b7280"
                    }
                  />
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    tw`text-xs font-medium`,
                    (isActive(page) || (page.label === "AI Chat" && activeTab === "chat")) 
                      ? tw`text-red-600 font-bold` 
                      : tw`text-gray-500`
                  ]}
                >
                  {page.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeScreen>
  );
}




// import { 
//   Pressable, 
//   Text, 
//   View, 
//   ScrollView,
//   Platform,
//   StatusBar 
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter, usePathname } from "expo-router";
// import { useAuth } from "@clerk/clerk-expo";
// import { useState } from "react";
// import SafeScreen from "@/components/SafeScreen";
// import tw from 'twrnc';

// export default function LandingPage() {
//   const router = useRouter();
//   const { isSignedIn } = useAuth();
//   const pathname = usePathname();
//   const [activeIcon, setActiveIcon] = useState<string | null>(null);

//   const handleGetStarted = () => {
//     if (isSignedIn) {
//       router.push("/(tabs)");
//     } else {
//       router.push("/(auth)/sign-in");
//     }
//   };

//   const pageIcons = [
//     { icon: "log-in" as keyof typeof Ionicons.glyphMap, route: "sign-in", label: "sign-in", path: "/sign-in" },
//     { icon: "logo-whatsapp" as keyof typeof Ionicons.glyphMap, route: "/whatsapp", label: "WhatsApp", path: "/whatsapp" },
//     { icon: "home" as keyof typeof Ionicons.glyphMap, route: "/(tabs)", label: "Home", path: "/(tabs)" },
//     { icon: "cube" as keyof typeof Ionicons.glyphMap, route: "/cube", label: "Cube", path: "/cube" },
//     // { icon: "paper-plane" as keyof typeof Ionicons.glyphMap, route: "/paper-plane", label: "Paper", path: "/paper-plane" },
//     // { icon: "feather" as keyof typeof Ionicons.glyphMap, route: "/feather", label: "Feather", path: "/feather" },
//     { icon: "book-outline" as keyof typeof Ionicons.glyphMap, route: "/blogs", label: "Blogs", path: "/blogs" },
//   ];

//   const handleIconPress = (route: string, label: string) => {
//     setActiveIcon(label);
//     router.push(route as any);
//   };

//   const isActive = (page: typeof pageIcons[0]) => {
//     if (activeIcon) {
//       return activeIcon === page.label;
//     }
//     return pathname.includes(page.path) || (page.path === "/(tabs)" && pathname === "/");
//   };

//   return (
//     <SafeScreen>
//       {/* Status bar handling */}
//       <StatusBar barStyle="dark-content" backgroundColor="white" />
      
//       <View style={tw`flex-1 bg-white`}>
//         {/* Main Content - Centered */}
//         <View style={tw`flex-1 items-center justify-center px-6`}>
          
//           {/* App Logo/Icon */}
//           <View style={tw`mb-8`}>
//             <View style={tw`w-24 h-24 rounded-full bg-red-100 items-center justify-center mx-auto mb-4`}>
//               <Ionicons name="fitness" size={48} color="#dc2626" />
//             </View>
//           </View>

//           {/* Welcome Text */}
//           <Text style={tw`text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2`}>
//             Welcome to my Portfolio
//           </Text>
          
//           <Text style={tw`text-2xl md:text-3xl font-bold text-red-600 text-center mb-6`}>
//             MD_Kayesur
//           </Text>

//           {/* Description */}
//           <Text style={tw`text-base md:text-lg text-gray-600 text-center leading-relaxed mb-10 max-w-md`}>
//             Start your fitness journey with us. Train hard, stay consistent, and achieve your goals step by step. Transform your body and mind.
//           </Text>

//           {/* Get Started Button */}
//           <Pressable 
//             onPress={handleGetStarted}
//             style={({ pressed }) => [
//               tw`bg-red-600 px-10 py-4 rounded-full shadow-lg`,
//               pressed && tw`bg-red-700 opacity-90`
//             ]}
//           >
//             <Text style={tw`text-white font-bold text-lg`}>
//              CLONE & GET STARTED NOW
//             </Text>
//           </Pressable>

//           {/* Features Grid (Visible on larger screens) */}
//           <View style={tw`hidden md:flex flex-row flex-wrap justify-center mt-12 gap-6 max-w-2xl`}>
//             {[
//               { icon: "barbell", label: "Workout Plans" },
//               { icon: "nutrition", label: "Nutrition Guide" },
//               { icon: "stats-chart", label: "Progress Track" },
//               { icon: "people", label: "Community" }
//             ].map((feature, index) => (
//               <View key={index} style={tw`items-center p-4`}>
//                 <View style={tw`w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-3`}>
//                   <Ionicons name={feature.icon as any} size={28} color="#dc2626" />
//                 </View>
//                 <Text style={tw`text-gray-700 font-medium`}>{feature.label}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Bottom Navigation - Fixed for mobile, different for web */}
//         {Platform.OS === 'web' ? (
//           // Web Navigation - Horizontal at bottom
//           <View style={tw`border-t border-gray-200 py-4`}>
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={tw`px-4 items-center justify-center gap-6`}
//             >
//               {pageIcons.map((page, index) => (
//                 <Pressable
//                   key={index}
//                   onPress={() => handleIconPress(page.route, page.label)}
//                   style={({ pressed }) => [
//                     tw`items-center  p-2 rounded-xl transition-all duration-200`,
//                     isActive(page) && tw`bg-red-50`,
//                     pressed && tw`opacity-70`
//                   ]}
//                 >
//                   <View style={tw`relative`}>
//                     <Ionicons
//                       name={page.icon}
//                       size={page.label === "Home" ? 28 : 24}
//                       color={isActive(page) ? "#dc2626" : "#6b7280"}
//                     />
//                     {isActive(page) && (
//                       <View style={tw`absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-red-600 rounded-full -ml-0.75`} />
//                     )}
//                   </View>
//                   <Text
//                     numberOfLines={1}
//                     style={[
//                       tw`text-xs mt-2 font-medium`,
//                       isActive(page) ? tw`text-red-600` : tw`text-gray-500`
//                     ]}
//                   >
//                     {page.label}
//                   </Text>
//                 </Pressable>
//               ))}
//             </ScrollView>
//           </View>
//         ) : (
//           // Mobile Navigation - Compact at bottom
//           <View style={tw`border-t border-gray-200 pt-3 pb-6 px-4`}>
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={tw`items-center justify-between w-full gap-2`}
//             >
//               {pageIcons.map((page, index) => (
//                 <Pressable
//                   key={index}
//                   onPress={() => handleIconPress(page.route, page.label)}
//                   style={({ pressed }) => [
//                     tw`flex-1 items-center p-2 min-w-16`,
//                     pressed && tw`opacity-70`
//                   ]}
//                 >
//                   <View style={[
//                     tw`w-12 h-12 rounded-full items-center justify-center mb-1`,
//                     isActive(page) ? tw`bg-red-100` : tw`bg-gray-100`
//                   ]}>
//                     <Ionicons
//                       name={page.icon}
//                       size={page.label === "Home" ? 24 : 20}
//                       color={isActive(page) ? "#dc2626" : "#6b7280"}
//                     />
//                   </View>
//                   <Text
//                     numberOfLines={1}
//                     style={[
//                       tw`text-xs font-medium`,
//                       isActive(page) ? tw`text-red-600` : tw`text-gray-500`
//                     ]}
//                   >
//                     {page.label}
//                   </Text>
//                 </Pressable>
//               ))}
//             </ScrollView>
//           </View>
//         )}
//       </View>
//     </SafeScreen>
//   );
// }






 