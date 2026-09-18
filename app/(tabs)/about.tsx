import {
    ScrollView,
    View,
    Text,
    Pressable,
    Image,
    Platform,
    Animated,
    KeyboardAvoidingView,
    Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState, useEffect } from "react";
import tw from 'twrnc';
import ProjectCard from "@/components/projectCard/ProjectCard";
import FeedbackSlider from "@/components/feedback/FeedbackSlider";
import GiveFeedbackForm from "@/components/feedback/GiveFeedbackForm";
import BottomNavigation from "@/components/BottomNavigation";

export default function AboutPage() {
    const router = useRouter();

    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<any>(null);
    const [keyboardPadding, setKeyboardPadding] = useState(0);

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const showSub = Keyboard.addListener(showEvent, (e) => {
            setKeyboardPadding(e.endCoordinates.height);
        });
        const hideSub = Keyboard.addListener(hideEvent, () => {
            setKeyboardPadding(0);
        });

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const handleFocusField = (targetRef: React.RefObject<any>) => {
        if (Platform.OS === 'web') {
            setTimeout(() => {
                try {
                    targetRef.current?.scrollIntoView?.({
                        behavior: 'smooth',
                        block: 'center',
                    });
                } catch (e) {}
            }, 100);
        } else if (scrollViewRef.current && targetRef?.current) {
            setTimeout(() => {
                try {
                    targetRef.current.measureLayout(
                        scrollViewRef.current,
                        (left: number, top: number, width: number, height: number) => {
                            scrollViewRef.current?.scrollTo?.({
                                y: Math.max(0, top - 120),
                                animated: true,
                            });
                        },
                        () => {}
                    );
                } catch (e) {}
            }, 100);
        }
    };

    const scrollYClamped = Animated.diffClamp(scrollY, 0, 100);
    const tabBarTranslateY = scrollYClamped.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 100],
        extrapolate: 'clamp',
    });

    return (
        <SafeAreaView style={tw`flex-1`}>
            {/* Back Button */}
            <Pressable
                onPress={() => router.back()}
                style={tw`absolute top-12 left-6 z-10 bg-white/10 p-2 rounded-full`}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>

            {/* Login Button */}
            <Pressable
                onPress={() => router.push('/login')}
                style={tw`absolute top-12 right-6 z-10 bg-purple-600 px-4 py-2 rounded-full`}
            >
                <Text style={tw`text-white font-bold font-mono`}>Login</Text>
            </Pressable>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
                style={tw`flex-1`}
            >
                <Animated.ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={[
                        tw`flex-grow px-6 pt-24 pb-12`,
                        { paddingBottom: keyboardPadding > 0 ? keyboardPadding + 80 : 48 },
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: Platform.OS !== 'web' }
                    )}
                    scrollEventThrottle={16}
                >
                    {/* Profile Section */}
                    <View style={tw`items-center mb-10`}>
                        <View style={tw`w-32 h-32 rounded-full border-4 border-purple-500 p-1 mb-4`}>
                            <Image
                                source={require('@/assets/images/kayes.jpg')}
                                style={tw`w-full h-full rounded-full`}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={tw`text-white text-3xl font-bold text-center`}>About Me</Text>
                        <View style={tw`h-1 w-20 bg-purple-500 mt-2 rounded-full`} />
                    </View>

                    {/* Content Section */}
                    <View style={tw`p-6 mb-6`}>
                        <Text style={tw`text-purple-400 text-xl font-bold mb-4 ${Platform.OS === 'web' ? 'contrast-text' : ''}`}>Who I Am</Text>
                        <Text style={tw`text-white text-lg leading-7 mb-4 ${Platform.OS === 'web' ? 'contrast-text' : ''}`}>
                            I am a dedicated <Text style={tw`text-purple-400 font-bold`}>Full Stack Developer</Text> and <Text style={tw`text-purple-400 font-bold`}>App Developer</Text> with a passion for creating high-performance, responsive, and user-centric applications.
                        </Text>
                        <Text style={tw`text-white text-base leading-6 opacity-80 ${Platform.OS === 'web' ? 'contrast-text' : ''}`}>
                            My journey in tech began with a curiosity for how things work on the web, which led me to master the MERN stack. Recently, I've expanded my expertise into mobile app development, leveraging Expo and React Native to build seamless cross-platform experiences.
                        </Text>
                    </View>

                    {/* Feedback Slider Section */}
                    <FeedbackSlider />

                    {/* Give Feedback Input Form Section */}
                    <GiveFeedbackForm onInputFocus={handleFocusField} />

                    {/* Experience/Education */}
                    <View style={tw`p-6 mt-6`}>
                        <Text style={tw`text-purple-400 text-xl font-bold mb-4`}>My Mission</Text>
                        <Text style={tw`text-white text-base leading-6 opacity-80`}>
                            To bridge the gap between complex backend logic and elegant frontend design, delivering products that not only work perfectly but also provide an exceptional user experience.
                        </Text>
                    </View>
                </Animated.ScrollView>
            </KeyboardAvoidingView>

            <BottomNavigation translateY={tabBarTranslateY} />
        </SafeAreaView>
    );
}
