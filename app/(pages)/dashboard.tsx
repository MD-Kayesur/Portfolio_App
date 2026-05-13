import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import tw from 'twrnc';
import SafeScreen from '@/components/SafeScreen';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';

const familyData = [
  {
    title: "kayes",
    label: "KAYESUR",
    nidFront: require('../../assets/images/family/mine/myNidfront.png'),
    nidBack: require('../../assets/images/family/mine/myNidBackround.png'),
    ssc: require('../../assets/images/family/mine/Ssc marsit.png'),
    hsc: require('../../assets/images/family/mine/Hsc sertificate.png'),
  },
  {
    title: "abbu",
    label: "FATHER",
    nidFront: require('../../assets/images/family/abbu/AbbuNidFront.png'),
    nidBack: require('../../assets/images/family/abbu/AbbuNidBackround.png'),
  },
  {
    title: "ammu",
    label: "MOTHER",
    nidFront: require('../../assets/images/family/ammu/AmmuNidFront.png'),
    nidBack: require('../../assets/images/family/ammu/AmmuNidBackround.png'),
  }
];

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("kayes");

  const handleDownload = async (imageRequire: any) => {
    try {
      const [{ localUri, uri }] = await Asset.loadAsync(imageRequire);
      const fileUri = localUri || uri;
      
      if (Platform.OS === 'web') {
        const doc = (globalThis as any).document;
        const link = doc.createElement('a');
        link.href = fileUri;
        link.download = 'document.png';
        doc.body.appendChild(link);
        link.click();
        doc.body.removeChild(link);
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'image/png',
            dialogTitle: 'Download Document',
            UTI: 'public.png'
          });
        } else {
          Alert.alert("Error", "Sharing/Downloading is not available on this device.");
        }
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert("Error", "Failed to download the document.");
    }
  };

  const renderPersonDocs = (person: any) => {
    return (
      <View style={tw`flex-col items-center mt-4`}>
        {['nidFront', 'nidBack', 'ssc', 'hsc'].map((key) => {
          if (!person[key]) return null;
          
          let title = '';
          if (key === 'nidFront') title = 'NID (Front)';
          if (key === 'nidBack') title = 'NID (Back)';
          if (key === 'ssc') title = 'SSC Certificate';
          if (key === 'hsc') title = 'HSC Certificate';

          return (
            <View key={key} style={tw`mb-10 items-center w-full relative`}>
              <View style={tw`w-full relative rounded-xl overflow-hidden bg-black/20`}>
                <Image 
                  source={person[key]} 
                  style={tw`w-full h-72`} 
                  resizeMode="contain" 
                />
                
                {/* Download Button Overlay */}
                <TouchableOpacity 
                  onPress={() => handleDownload(person[key])}
                  style={tw`absolute top-3 right-3 bg-cyan-600/90 py-2 px-4 rounded-full shadow-lg flex-row items-center border border-cyan-400/30`}
                >
                  <Ionicons name="download-outline" size={18} color="white" />
                  <Text style={tw`text-white font-bold font-mono ml-2 text-xs`}>Download</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={tw`text-white mt-3 font-mono text-center font-bold text-lg tracking-wide`}>{title}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeScreen>
      <View style={tw`flex-1 bg-transparent`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`absolute top-12 left-6 z-10 bg-white/10 p-2 rounded-full`}>
            <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={tw`px-6 pt-24 pb-4`}>
          <Text style={tw`text-3xl font-bold text-white mb-6 text-center font-mono`}>Admin Dashboard</Text>
          
          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`flex-row justify-center w-full`}>
            {familyData.map((person) => (
              <TouchableOpacity
                key={person.title}
                onPress={() => setActiveTab(person.title)}
                style={[
                  tw`px-4 py-2 mx-1 rounded-md transition-colors`,
                  activeTab === person.title ? tw`bg-purple-600` : tw`bg-white/10`
                ]}
              >
                <Text style={[
                  tw`font-bold font-mono text-sm tracking-widest`,
                  activeTab === person.title ? tw`text-white` : tw`text-gray-400`
                ]}>
                  {person.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={tw`px-6 pb-12`} showsVerticalScrollIndicator={false}>
          {familyData.map((person) => {
            if (person.title === activeTab) {
              return (
                <View key={person.title} style={tw`bg-white/5 p-4 rounded-3xl border border-white/10 mt-4 shadow-xl`}>
                  <Text style={tw`text-2xl font-bold text-purple-400 mb-2 capitalize font-mono text-center border-b border-white/10 pb-4`}>
                    {person.title === "kayes" ? "MD. Kayesur Rahman" : person.title}
                  </Text>
                  {renderPersonDocs(person)}
                </View>
              );
            }
            return null;
          })}
        </ScrollView>
      </View>
    </SafeScreen>
  );
}
