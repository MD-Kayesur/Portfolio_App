import {
  Pressable,
  Text,
  View,
  useColorScheme,
  Linking,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import { router } from "expo-router";

export default function whatsapp() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handleEmailPress = () => {
    Linking.openURL('mailto:mdkayesur@gmail.com')
      .catch(() => Alert.alert('Error', 'Cannot open email app'));
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+8801926360430')
      .catch(() => Alert.alert('Error', 'Cannot make a call'));
  };

  const handleWhatsAppPress = () => {
    Linking.openURL('https://wa.me/8801926360430')
      .catch(() => Alert.alert('Error', 'Cannot open WhatsApp'));
  };

  const handleSendMessage = () => {
    router.push('/(pages)/paper-plane');
  };

  return (
    <SafeAreaView style={[
      tw`flex-1`,
      { backgroundColor: 'transparent' }
    ]}>
      <View style={tw`flex-1 px-4`}>

        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          style={tw`absolute top-2 left-4 z-10 bg-white/10 dark:bg-gray-800/10 p-2 rounded-full shadow-sm`}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDarkMode ? "white" : "white"}
          />
        </Pressable>

        {/* Header */}
        <View style={tw`items-center mt-6 mb-10`}>
          <View style={tw`w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mb-4`}>
            <Ionicons name="chatbubbles" size={40} color="#dc2626" />
          </View>
          <Text style={[
            tw`text-3xl font-bold`,
            tw`text-white`
          ]}>
            Get In Touch
          </Text>
          <Text style={[
            tw`mt-2 text-center text-base`,
            tw`text-gray-300`
          ]}>
            Feel free to reach out anytime
          </Text>
        </View>

        {/* whatsapp Cards */}
        <View style={tw`gap-4 mb-8`}>

          {/* Email Card */}
          <Pressable
            onPress={handleEmailPress}
            style={[
              tw`flex-row items-center p-5 rounded-2xl bg-white/10`,
              { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }
            ]}
          >
            <View style={tw`w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mr-4`}>
              <Ionicons name="mail" size={24} color="#dc2626" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-gray-400 text-sm`}>Email</Text>
              <Text style={[
                tw`text-lg font-semibold text-white`,
              ]}>
                mdkayesur@gmail.com
              </Text>
            </View>
            <Ionicons name="open-outline" size={20} color={isDarkMode ? "#9ca3af" : "#9ca3af"} />
          </Pressable>

          {/* Phone Card */}
          <Pressable
            onPress={handlePhonePress}
            style={[
              tw`flex-row items-center p-5 rounded-2xl bg-white/10`,
              { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }
            ]}
          >
            <View style={tw`w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mr-4`}>
              <Ionicons name="call" size={24} color="#059669" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-gray-400 text-sm`}>Phone</Text>
              <Text style={[
                tw`text-lg font-semibold text-white`,
              ]}>
                +880 1926-360430
              </Text>
            </View>
            <Ionicons name="open-outline" size={20} color={isDarkMode ? "#9ca3af" : "#9ca3af"} />
          </Pressable>

          {/* Location Card */}
          <View style={[
            tw`flex-row items-center p-5 rounded-2xl bg-white/10`,
            { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }
          ]}>
            <View style={tw`w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-4`}>
              <Ionicons name="location" size={24} color="#3b82f6" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-gray-400 text-sm`}>Location</Text>
              <Text style={[
                tw`text-lg font-semibold text-white`,
              ]}>
                Dhaka, Bangladesh
              </Text>
            </View>
          </View>
        </View>

        {/* WhatsApp Button */}
        <Pressable
          onPress={handleWhatsAppPress}
          style={tw`flex-row items-center justify-center bg-white/80 border-2 border-white/20 py-4 rounded-xl mb-4`}
        >
          <Ionicons name="logo-whatsapp" size={24} color="black" />
          <Text style={tw`text-black text-lg font-bold ml-3`}>Chat on WhatsApp</Text>
        </Pressable>

        {/* Send Message Button - Glass Dark themed with White Text for visibility */}
        <Pressable
          onPress={handleSendMessage}
          style={({ pressed }) => [
            tw`bg-purple-600/20 py-4 rounded-xl border border-white/20 shadow-md`,
            pressed && tw`bg-purple-600/30`
          ]}
        >
          <View style={tw`flex-row items-center justify-center`}>
            <Ionicons name="mail" size={28} color="white" />
            <Text
              style={[tw`text-white text-2xl font-bold ml-3`, { includeFontPadding: false, textAlignVertical: 'center' }]}
              numberOfLines={1}
            >
              Send Message
            </Text>
          </View>
        </Pressable>


        {/* Footer Note */}
        <Text style={[
          tw`text-center mt-8 text-sm text-gray-400`,
        ]}>
          We typically respond within 24 hours
        </Text>
      </View>
    </SafeAreaView>
  );
}
