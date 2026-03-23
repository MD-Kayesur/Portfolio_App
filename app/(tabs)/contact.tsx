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
import { useRouter } from "expo-router";

export default function Contact() {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const router = useRouter();

    const handleEmailPress = () => {
        Linking.openURL('mailto:example@gamil.com')
            .catch(() => Alert.alert('Error', 'Cannot open email app'));
    };

    const handlePhonePress = () => {
        Linking.openURL('tel:+1234-56789')
            .catch(() => Alert.alert('Error', 'Cannot make a call'));
    };

    const handleWhatsAppPress = () => {
        Linking.openURL('https://wa.me/1234-56789')
            .catch(() => Alert.alert('Error', 'Cannot open WhatsApp'));
    };

    const handleSendMessage = () => {
        Alert.alert(
            'Message Sent',
            'Your message has been sent successfully!',
            [
                { text: 'OK', onPress: () => router.back() }
            ]
        );
    };

    return (
        <SafeAreaView style={[
            tw`flex-1`,
            isDarkMode ? tw`bg-black` : tw`bg-gray-50`
        ]}>
            <View style={tw`flex-1 px-4`}>

                {/* Back Button */}
                <Pressable
                    onPress={() => router.back()}
                    style={tw`absolute top-10 left-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm`}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={isDarkMode ? "white" : "black"}
                    />
                </Pressable>

                {/* Header */}
                <View style={tw`items-center mt-20 mb-10`}>
                    <View style={tw`w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 items-center justify-center mb-4`}>
                        <Ionicons name="chatbubbles" size={40} color="#dc2626" />
                    </View>
                    <Text style={[
                        tw`text-3xl font-bold`,
                        isDarkMode ? tw`text-white` : tw`text-gray-900`
                    ]}>
                        Get In Touch
                    </Text>
                    <Text style={[
                        tw`mt-2 text-center text-base`,
                        isDarkMode ? tw`text-gray-300` : tw`text-gray-600`
                    ]}>
                        Feel free to reach out anytime
                    </Text>
                </View>

                {/* Contact Cards */}
                <View style={tw`gap-4 mb-8`}>

                    {/* Email Card */}
                    <Pressable
                        onPress={handleEmailPress}
                        style={[
                            tw`flex-row items-center p-5 rounded-2xl`,
                            isDarkMode ? tw`bg-gray-900` : tw`bg-white`,
                            { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }
                        ]}
                    >
                        <View style={tw`w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 items-center justify-center mr-4`}>
                            <Ionicons name="mail" size={24} color="#dc2626" />
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={tw`text-gray-400 text-sm`}>Email</Text>
                            <Text style={[
                                tw`text-lg font-semibold`,
                                isDarkMode ? tw`text-white` : tw`text-gray-800`
                            ]}>
                                example@gamil.com
                            </Text>
                        </View>
                        <Ionicons name="open-outline" size={20} color={isDarkMode ? "#9ca3af" : "#6b7280"} />
                    </Pressable>

                    {/* Phone Card */}
                    <Pressable
                        onPress={handlePhonePress}
                        style={[
                            tw`flex-row items-center p-5 rounded-2xl`,
                            isDarkMode ? tw`bg-gray-900` : tw`bg-white`,
                            { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }
                        ]}
                    >
                        <View style={tw`w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 items-center justify-center mr-4`}>
                            <Ionicons name="call" size={24} color="#059669" />
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={tw`text-gray-400 text-sm`}>Phone</Text>
                            <Text style={[
                                tw`text-lg font-semibold`,
                                isDarkMode ? tw`text-white` : tw`text-gray-800`
                            ]}>
                                +880 1234-56789
                            </Text>
                        </View>
                        <Ionicons name="open-outline" size={20} color={isDarkMode ? "#9ca3af" : "#6b7280"} />
                    </Pressable>

                    {/* Location Card */}
                    <View style={[
                        tw`flex-row items-center p-5 rounded-2xl`,
                        isDarkMode ? tw`bg-gray-900` : tw`bg-white`,
                        { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }
                    ]}>
                        <View style={tw`w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center mr-4`}>
                            <Ionicons name="location" size={24} color="#3b82f6" />
                        </View>
                        <View style={tw`flex-1`}>
                            <Text style={tw`text-gray-400 text-sm`}>Location</Text>
                            <Text style={[
                                tw`text-lg font-semibold`,
                                isDarkMode ? tw`text-white` : tw`text-gray-800`
                            ]}>
                                Dhaka, Bangladesh
                            </Text>
                        </View>
                    </View>
                </View>

                {/* WhatsApp Button */}
                <Pressable
                    onPress={handleWhatsAppPress}
                    style={tw`flex-row items-center justify-center bg-green-600 py-4 rounded-xl mb-4`}
                >
                    <Ionicons name="logo-whatsapp" size={24} color="white" />
                    <Text style={tw`text-white text-lg font-bold ml-3`}>Chat on WhatsApp</Text>
                </Pressable>

                {/* Send Message Button */}
                <Pressable
                    onPress={handleSendMessage}
                    style={({ pressed }) => [
                        tw`bg-red-700 py-4 rounded-xl items-center`,
                        pressed && tw`opacity-80`
                    ]}
                >
                    <Text style={tw`text-white text-lg font-bold`}>Send Message</Text>
                </Pressable>

                {/* Footer Note */}
                <Text style={[
                    tw`text-center mt-8 text-sm`,
                    isDarkMode ? tw`text-gray-400` : tw`text-gray-500`
                ]}>
                    We typically respond within 24 hours
                </Text>
            </View>
        </SafeAreaView>
    );
}







