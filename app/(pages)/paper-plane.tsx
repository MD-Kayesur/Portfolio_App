import { View, Text, Pressable, TextInput, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from 'twrnc';
import { useState } from "react";
import { useSendContactMutation } from "@/redux/feature/contact/contactApi";

export default function PaperPlanePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendContact, { isLoading }] = useSendContactMutation();

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await sendContact({ name, email, message }).unwrap();
      if (response.success) {
        Alert.alert("Success", "Your message has been sent!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    } catch (err) {
      Alert.alert("Error", "Could not connect to the server.");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`flex-grow`}>
        {/* Header */}
        <View style={tw`flex-row items-center px-6 pt-10`}>
          <Pressable
            onPress={() => router.back()}
            style={tw`p-3`}
          >
            <Ionicons name="arrow-back" size={28} color="black" />
          </Pressable>
          <Text style={tw`text-2xl font-bold text-black ml-4`}>Get in Touch</Text>
        </View>

        {/* Main Content */}
        <View style={tw`flex-1 items-center px-6 py-4`}>

          {/* Plane Icon */}
          <View style={tw`mb-6`}>
            <View style={[tw`w-28 h-28 rounded-full items-center justify-center shadow-lg`, { backgroundColor: '#000' }]}>
              <Ionicons name="paper-plane" size={56} color="white" />
            </View>
          </View>

          {/* Title */}
          <Text style={tw`text-3xl font-bold text-black mb-1`}>
            Send a Message
          </Text>

          {/* Description */}
          <Text style={tw`text-center text-gray-700 mb-8 text-base px-4`}>
            I'd love to hear from you. Enter your details below.
          </Text>

          {/* Form Fields container with slight padding/margin for visibility */}
          <View style={tw`w-full gap-5`}>
            <View>
              <Text style={tw`text-black font-bold mb-1.5 ml-1`}>Name</Text>
              <TextInput
                style={tw`bg-gray-50 border border-gray-300 rounded-xl p-4 text-lg text-black`}
                placeholder="Enter your name"
                placeholderTextColor="#9ca3af"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View>
              <Text style={tw`text-black font-bold mb-1.5 ml-1`}>Email</Text>
              <TextInput
                style={tw`bg-gray-50 border border-gray-300 rounded-xl p-4 text-lg text-black`}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text style={tw`text-black font-bold mb-1.5 ml-1`}>Message</Text>
              <TextInput
                style={tw`bg-gray-50 border border-gray-300 rounded-xl p-4 text-lg h-40 text-black`}
                placeholder="How can I help you?"
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
              />
            </View>
          </View>

          {/* Action Button - Large and prominent blow the form */}
          <View style={tw`w-full mt-10 mb-10`}>
            <Pressable
              onPress={handleSend}
              style={({ pressed }) => [
                tw`w-full px-6 py-4 rounded-xl items-center shadow-md`,
                { backgroundColor: '#000' },
                (pressed || isLoading || !message.trim()) && tw`opacity-70`
              ]}
              disabled={isLoading || !message.trim()}
            >
              <Text style={tw`text-white font-bold text-xl`}>
                {isLoading ? "Sending..." : "Send Message"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.back()}
              style={tw`mt-4 items-center`}
            >
              <Text style={tw`text-gray-500 font-semibold`}>Go Back</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

}