import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import SafeScreen from '@/components/SafeScreen';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Check against standard variable or the VITE_ADMIN_EMAILS requested
    const adminEmailsStr = process.env.VITE_ADMIN_EMAILS || process.env.EXPO_PUBLIC_ADMIN_EMAILS || "rmdkayesur@gmail.com,mdkayesurrahman67@gmail.com";
    const adminEmails = adminEmailsStr.split(',');
    
    if (adminEmails.includes(email.toLowerCase().trim())) {
      router.push('/dashboard');
    } else {
      Alert.alert(
        "Access Denied", 
        "Eita amar profile! Permission chara dhukar chesta korle, bhuter ghor e pathe dite pari! 👻🚫\n\nProfile ta FBI level guarded! Permission slip chhara NO ENTRY!"
      );
    }
  };

  return (
    <SafeScreen>
      <View style={tw`flex-1 px-6 justify-center bg-transparent`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`absolute top-12 left-6 z-10 bg-white/10 p-2 rounded-full`}>
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={tw`text-3xl font-bold text-white mb-8 text-center font-mono`}>Admin Login</Text>
        
        <TextInput 
          style={tw`bg-white/10 text-white px-4 py-4 rounded-lg mb-6 font-mono text-base`}
          placeholder="Enter Admin Email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TouchableOpacity style={tw`bg-purple-600 py-4 rounded-lg items-center`} onPress={handleLogin}>
          <Text style={tw`text-white font-bold text-lg font-mono`}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}
