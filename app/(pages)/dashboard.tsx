import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Platform, Alert, Animated, Linking, StyleSheet } from 'react-native';
import tw from 'twrnc';
import SafeScreen from '@/components/SafeScreen';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { BlurView } from 'expo-blur';
import BottomNavigation from '@/components/BottomNavigation';

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
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollYClamped = Animated.diffClamp(scrollY, 0, 100);
  const tabBarTranslateY = scrollYClamped.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 100],
      extrapolate: 'clamp',
  });

  const getTargetFileUri = async (imageRequire: any, title: string) => {
    const asset = Asset.fromModule(imageRequire);
    if (!asset.downloaded) {
      await asset.downloadAsync();
    }
    
    const sourceUri = asset.localUri || asset.uri;
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `${sanitizedTitle}.png`;

    if (Platform.OS === 'web') {
      return { sourceUri, filename, isWeb: true, rawUri: asset.uri };
    }

    const targetPath = `${FileSystem.cacheDirectory}${Date.now()}_${filename}`;
    
    if (sourceUri.startsWith('http://') || sourceUri.startsWith('https://')) {
      const res = await FileSystem.downloadAsync(sourceUri, targetPath);
      return { sourceUri: res.uri, filename, isWeb: false, rawUri: asset.uri };
    } else if (sourceUri.startsWith('file://') || sourceUri.startsWith('/') || sourceUri.startsWith('assets-library://')) {
      try {
        await FileSystem.copyAsync({ from: sourceUri, to: targetPath });
        return { sourceUri: targetPath, filename, isWeb: false, rawUri: asset.uri };
      } catch (err) {
        return { sourceUri, filename, isWeb: false, rawUri: asset.uri };
      }
    }
    return { sourceUri, filename, isWeb: false, rawUri: asset.uri };
  };

  const handleDownload = async (imageRequire: any, title: string) => {
    try {
      const asset = Asset.fromModule(imageRequire);
      if (!asset.downloaded) {
        await asset.downloadAsync();
      }
      
      const sourceUri = asset.localUri || asset.uri;
      const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const filename = `${sanitizedTitle}.png`;

      if (Platform.OS === 'web') {
        const response = await fetch(sourceUri);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const doc = (globalThis as any).document;
        const link = doc.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        doc.body.appendChild(link);
        link.click();
        doc.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        Alert.alert("Success", `${title} downloaded successfully!`);
        return;
      }

      // Direct Download logic like Resume/CV download: open direct asset URI via Linking
      const downloadUrl = asset.uri || sourceUri;
      if (downloadUrl && (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://'))) {
        const canOpen = await Linking.canOpenURL(downloadUrl);
        if (canOpen) {
          await Linking.openURL(downloadUrl);
          return;
        }
      }

      // Fallback: Copy to document directory and open with Linking
      const localDocPath = `${FileSystem.documentDirectory}${filename}`;
      if (sourceUri.startsWith('http://') || sourceUri.startsWith('https://')) {
        await FileSystem.downloadAsync(sourceUri, localDocPath);
      } else {
        try {
          await FileSystem.copyAsync({ from: sourceUri, to: localDocPath });
        } catch (copyErr) {
          // ignore
        }
      }
      const fileInfo = await FileSystem.getInfoAsync(localDocPath);
      const fileToOpen = fileInfo.exists ? localDocPath : sourceUri;
      await Linking.openURL(fileToOpen);
    } catch (error) {
      console.error("Error downloading document:", error);
      Alert.alert("Error", `Failed to download ${title}. Please try again.`);
    }
  };

  const handleShare = async (imageRequire: any, title: string) => {
    try {
      const { sourceUri, filename, isWeb } = await getTargetFileUri(imageRequire, title);

      if (isWeb) {
        if ((globalThis as any).navigator?.share) {
          const response = await fetch(sourceUri);
          const blob = await response.blob();
          const file = new File([blob], filename, { type: 'image/png' });
          if ((globalThis as any).navigator.canShare?.({ files: [file] })) {
            await (globalThis as any).navigator.share({
              files: [file],
              title: title,
              text: `Check out ${title}`
            });
            return;
          }
        }
        Alert.alert("Share", `Please use the Download option to save ${title}.`);
        return;
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(sourceUri, {
          mimeType: 'image/png',
          dialogTitle: `Share ${title}`,
          UTI: 'public.png'
        });
      } else {
        Alert.alert("Notice", "Sharing is not supported on this device.");
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      Alert.alert("Error", `Failed to share ${title}. Please try again.`);
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

          const isMenuOpen = openMenuKey === `${person.title}_${key}`;

          return (
            <View key={key} style={tw`mb-10 items-center w-full relative`}>
              <View style={tw`w-full relative rounded-xl overflow-hidden bg-black/20`}>
                <Image 
                  source={person[key]} 
                  style={tw`w-full h-72`} 
                  resizeMode="contain" 
                />
                
                {/* 3-Dot Action Button Trigger */}
                <TouchableOpacity 
                  onPress={() => setOpenMenuKey(isMenuOpen ? null : `${person.title}_${key}`)}
                  style={tw`absolute top-3 right-3 rounded-full overflow-hidden shadow-lg border border-white/25 z-30`}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
                  <View style={tw`bg-white/35 p-2.5 items-center justify-center`}>
                    <Ionicons name={isMenuOpen ? "close" : "ellipsis-vertical"} size={18} color="white" />
                  </View>
                </TouchableOpacity>

                {/* Dropdown Action Menu */}
                {isMenuOpen && (
                  <>
                    {/* Backdrop to dismiss menu on tap outside */}
                    <TouchableOpacity 
                      style={StyleSheet.absoluteFill} 
                      activeOpacity={1} 
                      onPress={() => setOpenMenuKey(null)} 
                    />

                    <View 
                      style={tw`absolute top-14 right-3 rounded-2xl overflow-hidden shadow-2xl z-30 border border-white/25`}
                    >
                      <BlurView intensity={85} tint="dark" style={StyleSheet.absoluteFill} />
                      <View style={tw`bg-white/25 p-1 flex-col items-center justify-center`}>
                        <TouchableOpacity 
                          onPress={() => {
                            setOpenMenuKey(null);
                            handleDownload(person[key], title);
                          }}
                          style={tw`w-10 h-10 rounded-xl items-center justify-center active:bg-cyan-500/30`}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="download-outline" size={30} color="#02e0fdff" />
                        </TouchableOpacity>

                        <View style={tw`w-6 h-[1px] bg-white/20 my-1`} />

                        <TouchableOpacity 
                          onPress={() => {
                            setOpenMenuKey(null);
                            handleShare(person[key], title);
                          }}
                          style={tw`w-10 h-10 rounded-xl items-center justify-center active:bg-purple-500/30`}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="share-social-outline" size={30} color="#a604acff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
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

        <Animated.ScrollView 
          contentContainerStyle={tw`px-6 pb-32`} 
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: Platform.OS !== 'web' }
          )}
          scrollEventThrottle={16}
        >
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
        </Animated.ScrollView>
      </View>
      <BottomNavigation translateY={tabBarTranslateY} />
    </SafeScreen>
  );
}
