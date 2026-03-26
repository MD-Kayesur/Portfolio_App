
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    Dimensions,
    StyleSheet,
    Platform,
    ImageStyle,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LandingHero = () => {
    const titles = ['FrontEnd Developer', 'Full Stack Developer', 'App Developer', 'MERN Stack Developer'];
    const [displayText, setDisplayText] = useState('');
    const [titleIndex, setTitleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const handleTyping = () => {
            const currentTitle = titles[titleIndex];
            if (isDeleting) {
                setDisplayText(prev => prev.substring(0, prev.length - 1));
                setTypingSpeed(80); // Faster deleting
            } else {
                setDisplayText(prev => currentTitle.substring(0, prev.length + 1));
                setTypingSpeed(150); // Standard typing
            }

            if (!isDeleting && displayText === currentTitle) {
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && displayText === '') {
                setIsDeleting(false);
                setTitleIndex((prev) => (prev + 1) % titles.length);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, titleIndex]);

    const handleDownloadCV = async () => {
        try {
            const cvUrl = "https://raw.githubusercontent.com/MD-Kayesur/Portfolio_App/main/assets/images/My_Resume%20(1).pdf";
            await Linking.openURL(cvUrl);
        } catch (error) {
            console.error("Failed to download CV:", error);
        }
    };

    return (
        <View style={[styles.container as ViewStyle, tw`px-6 py-12`]}>
            <View style={tw`flex-1 flex-col md:flex-row items-center justify-between`}>
                {/* Left Content */}
                <View style={tw`flex-1 mb-10 md:mb-0`}>
                    <View>
                        <Text style={[tw`text-lg font-medium mb-2 ${Platform.OS === 'web' ? 'contrast-text' : 'text-white'}`, styles.textReadability]}>
                            Hello. I'm
                        </Text>
                        <Text style={[tw`text-4xl md:text-6xl font-black mb-4 leading-tight ${Platform.OS === 'web' ? 'contrast-text' : 'text-white'}`, styles.textReadability]}>
                            MD. Kayesur Rahman
                        </Text>

                        <View style={tw`flex-row items-center mb-6`}>
                            <Text style={tw`text-purple-400 text-xl font-bold mr-2`}>
                                i am
                            </Text>
                            <View style={tw`flex-row items-center`}>
                                <Text style={tw`text-white text-xl font-bold`}>
                                    {displayText}
                                </Text>
                                {/* Blinking Cursor */}
                                <View style={[styles.cursor, tw`bg-purple-400 ml-1`]} />
                            </View>
                        </View>

                        <Text style={[tw`text-base md:text-lg mb-8 leading-relaxed max-w-xl ${Platform.OS === 'web' ? 'contrast-text' : 'text-gray-200'}`, styles.textReadability]}>
                            Front-End Developer crafting high-performance, responsive, and user-friendly web applications
                            using modern technologies, clean code, and best practices for seamless user experiences.
                        </Text>

                        {/* Single "My CV" Button */}
                        <TouchableOpacity
                            onPress={handleDownloadCV}
                            activeOpacity={0.8}
                            style={[
                                styles.button as ViewStyle,
                                { shadowColor: '#9333ea', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 }
                            ]}
                        >
                            <Ionicons name="download-outline" size={22} color="white" style={tw`mr-2`} />
                            <Text style={tw`text-white text-lg font-bold text-center`}>My CV</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Right Content - Profile Image */}
                <View style={styles.imageWrapper as ViewStyle}>
                    <View style={styles.imageBorder as ViewStyle}>
                        <Image
                            source={require('../assets/images/kayes.jpg')}
                            style={styles.profileImg as ImageStyle}
                            resizeMode="cover"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        minHeight: Platform.OS === 'web' ? 600 : SCREEN_HEIGHT * 0.7,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#9333ea',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 35,
        paddingVertical: 18,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    imageWrapper: {
        position: 'relative',
        padding: 10,
    },
    imageBorder: {
        borderWidth: 4,
        borderColor: '#9333ea',
        borderRadius: 30,
        borderTopLeftRadius: 80,
        padding: 10,
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
    },
    profileImg: {
        width: SCREEN_WIDTH > 768 ? 320 : 250,
        height: SCREEN_WIDTH > 768 ? 400 : 320,
        borderRadius: 20,
        borderTopLeftRadius: 70,
    },
    cursor: {
        width: 3,
        height: 24,
        opacity: 1,
    },
    textReadability: {
        ...Platform.select({
            ios: {
                textShadowColor: 'rgba(0, 0, 0, 0.9)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 15,
            },
            android: {
                textShadowColor: 'rgba(0, 0, 0, 0.9)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 15,
            },
            web: {
                // Already handled by mix-blend-mode in CSS
            }
        })
    }
});

export default LandingHero;
