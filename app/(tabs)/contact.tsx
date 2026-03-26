import {
    Pressable,
    Text,
    View,
    Linking,
    Alert,
    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import { useRouter } from "expo-router";

export default function Contact() {
    const router = useRouter();

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
        <SafeAreaView style={tw`flex-1`}>
            <View style={tw`flex-1 px-6`}>

                {/* Back Button */}
                <Pressable
                    onPress={() => router.back()}
                    style={tw`absolute top-12 left-6 z-10 bg-white/10 p-2 rounded-full`}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="white"
                    />
                </Pressable>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`pb-12`}
                >
                    {/* Header */}
                    <View style={tw`items-center mt-24 mb-10`}>
                        <View style={tw`w-24 h-24 rounded-full bg-purple-500/20 border border-purple-500/30 items-center justify-center mb-4`}>
                            <Ionicons name="chatbubbles" size={48} color="#a855f7" />
                        </View>
                        <Text style={tw`text-4xl font-black text-white`}>
                            Get In Touch
                        </Text>
                        <Text style={tw`mt-2 text-center text-lg text-gray-400 px-4`}>
                            Have a project in mind? Let's build something amazing together.
                        </Text>
                    </View>

                    {/* Contact Cards */}
                    <View style={tw`gap-4 mb-10`}>

                        {/* Email Card */}
                        <Pressable
                            onPress={handleEmailPress}
                            style={tw`flex-row items-center p-6 rounded-3xl bg-white/10 border border-white/10`}
                        >
                            <View style={tw`w-14 h-14 rounded-2xl bg-purple-500/20 items-center justify-center mr-5`}>
                                <Ionicons name="mail" size={28} color="#a855f7" />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-gray-400 text-xs uppercase font-bold tracking-widest`}>Email</Text>
                                <Text style={tw`text-lg font-bold text-white mt-1`}>
                                    mdkayesur@gmail.com
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                        </Pressable>

                        {/* Phone Card */}
                        <Pressable
                            onPress={handlePhonePress}
                            style={tw`flex-row items-center p-6 rounded-3xl bg-white/10 border border-white/10`}
                        >
                            <View style={tw`w-14 h-14 rounded-2xl bg-emerald-500/20 items-center justify-center mr-5`}>
                                <Ionicons name="call" size={28} color="#10b981" />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-gray-400 text-xs uppercase font-bold tracking-widest`}>Phone</Text>
                                <Text style={tw`text-lg font-bold text-white mt-1`}>
                                    +880 1926-360430
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                        </Pressable>

                        {/* Location Card */}
                        <View style={tw`flex-row items-center p-6 rounded-3xl bg-white/10 border border-white/10`}>
                            <View style={tw`w-14 h-14 rounded-2xl bg-blue-500/20 items-center justify-center mr-5`}>
                                <Ionicons name="location" size={28} color="#3b82f6" />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-gray-400 text-xs uppercase font-bold tracking-widest`}>Location</Text>
                                <Text style={tw`text-lg font-bold text-white mt-1`}>
                                    Dhaka, Bangladesh
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={tw`gap-4`}>
                        {/* WhatsApp Button */}
                        <Pressable
                            onPress={handleWhatsAppPress}
                            style={tw`flex-row items-center justify-center bg-emerald-600 py-5 rounded-2xl shadow-lg`}
                        >
                            <Ionicons name="logo-whatsapp" size={28} color="white" />
                            <Text style={tw`text-white text-xl font-black ml-3`}>Chat on WhatsApp</Text>
                        </Pressable>

                        {/* Send Message Button */}
                        <Pressable
                            onPress={handleSendMessage}
                            style={({ pressed }) => [
                                tw`bg-white py-5 rounded-2xl items-center shadow-lg`,
                                pressed && tw`opacity-90`
                            ]}
                        >
                            <Text style={tw`text-black text-xl font-black`}>Send Direct Message</Text>
                        </Pressable>
                    </View>

                    {/* Footer Note */}
                    <Text style={tw`text-center mt-10 text-sm text-gray-500 font-medium`}>
                        Average response time: &lt; 24 hours
                    </Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
