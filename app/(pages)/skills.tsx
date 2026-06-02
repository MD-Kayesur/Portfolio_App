import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Easing, Dimensions, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SafeScreen from '@/components/SafeScreen';
import { useGetSkillsQuery } from '@/redux/feature/skills/skillApi';
import BottomNavigation from '@/components/BottomNavigation';

const { width } = Dimensions.get('window');

// Map web 'react-icons' names to Expo Vector Icons
const getMappedIcon = (iconName: string, color: string, size = 48) => {
    const map: Record<string, { family: string, name: string }> = {
        'FaReact': { family: 'FontAwesome5', name: 'react' },
        'FaNodeJs': { family: 'FontAwesome5', name: 'node-js' },
        'SiNodedotjs': { family: 'FontAwesome5', name: 'node-js' },
        'FaPython': { family: 'FontAwesome5', name: 'python' },
        'FaJs': { family: 'FontAwesome5', name: 'js' },
        'SiJavascript': { family: 'FontAwesome5', name: 'js' },
        'FaHtml5': { family: 'FontAwesome5', name: 'html5' },
        'FaCss3Alt': { family: 'FontAwesome5', name: 'css3-alt' },
        'SiMongodb': { family: 'MaterialCommunityIcons', name: 'database' },
        'SiExpress': { family: 'MaterialCommunityIcons', name: 'server-network' },
        'FaGithub': { family: 'FontAwesome5', name: 'github' },
        'FaGitAlt': { family: 'FontAwesome5', name: 'git-alt' },
        'FaDocker': { family: 'FontAwesome5', name: 'docker' },
        'FaAws': { family: 'FontAwesome5', name: 'aws' },
        'FaFigma': { family: 'FontAwesome5', name: 'figma' },
        'FaAndroid': { family: 'FontAwesome5', name: 'android' },
        'FaApple': { family: 'FontAwesome5', name: 'apple' },
        'SiTypescript': { family: 'MaterialCommunityIcons', name: 'language-typescript' },
        'SiTailwindcss': { family: 'MaterialCommunityIcons', name: 'tailwind' },
        'SiNextdotjs': { family: 'MaterialCommunityIcons', name: 'vuejs' }, // fallback visually
        'FaDatabase': { family: 'FontAwesome5', name: 'database' },
    };

    const mapped = map[iconName];
    if (mapped) {
        if (mapped.family === 'FontAwesome5') return <FontAwesome5 name={mapped.name as any} size={size} color={color} />;
        if (mapped.family === 'MaterialCommunityIcons') return <MaterialCommunityIcons name={mapped.name as any} size={size} color={color} />;
    }
    
    // Fallback if not found
    return <Ionicons name="code-slash" size={size} color={color} />;
};

const MarqueeRow = ({ skills, title, direction = 'left', speedMultiplier = 40 }: any) => {
    const scrollX = useRef(new Animated.Value(0)).current;

    // Fixed width calculations to make infinite loop perfect
    const ITEM_WIDTH = 160; // 128 (w-32) + 32 (mx-4)
    const contentWidth = skills.length * ITEM_WIDTH;
    const duration = contentWidth * speedMultiplier;

    useEffect(() => {
        if (contentWidth === 0) return;

        const startAnim = () => {
            scrollX.setValue(direction === 'left' ? 0 : -contentWidth);
            Animated.loop(
                Animated.timing(scrollX, {
                    toValue: direction === 'left' ? -contentWidth : 0,
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: Platform.OS !== 'web',
                })
            ).start();
        };
        startAnim();
    }, [direction, contentWidth, duration, scrollX]);

    // Duplicate array multiple times to ensure the screen is always filled seamlessly
    const displaySkills = [...skills, ...skills, ...skills, ...skills, ...skills];

    if (skills.length === 0) return null;

    return (
        <View style={tw`mb-12`}>
            <Text style={tw`text-2xl font-bold text-white ml-6 mb-6 font-mono`}>{title}</Text>
            <View style={tw`overflow-hidden flex-row`}>
                <Animated.View style={[tw`flex-row`, { transform: [{ translateX: scrollX }] }]}>
                    {displaySkills.map((skill, idx) => (
                        <View key={`${skill._id || skill.title}-${idx}`} style={[tw`items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-4 w-32 h-32`, { marginHorizontal: 16 }]}>
                            {getMappedIcon(skill.iconName, skill.color || '#fff')}
                            <Text style={tw`text-white font-semibold mt-4 text-center text-sm font-mono`} numberOfLines={1}>
                                {skill.title}
                            </Text>
                        </View>
                    ))}
                </Animated.View>
            </View>
        </View>
    );
};

export default function SkillsPage() {
    const router = useRouter();
    const { data: skills = [], isLoading } = useGetSkillsQuery();

    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollYClamped = Animated.diffClamp(scrollY, 0, 100);
    const tabBarTranslateY = scrollYClamped.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 100],
        extrapolate: 'clamp',
    });

    // Helper to identify app-specific skills regardless of how they were typed
    const isAppSkill = (title: string, type: string) => {
        if (type === 'app') return true;
        const normalized = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        return ['reactnative', 'expo', 'flutter', 'ios', 'android', 'swift', 'kotlin', 'mobile'].includes(normalized);
    };

    const appSkills = skills.filter((s: any) => isAppSkill(s.title || '', s.type || ''));
    const frontendSkills = skills.filter((s: any) => s.type === 'frontend' && !isAppSkill(s.title || '', s.type || ''));
    const backendSkills = skills.filter((s: any) => s.type === 'backend' && !isAppSkill(s.title || '', s.type || ''));

    return (
        <SafeScreen>
            <View style={tw`flex-1 bg-transparent`}>
                {/* Header */}
                <View style={tw`flex-row items-center justify-between px-6 py-4 border-b border-white/10`}>
                    <TouchableOpacity onPress={() => router.back()} style={tw`bg-white/10 p-2 rounded-full`}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={tw`text-2xl font-bold text-white font-mono`}>My Skills</Text>
                    <View style={tw`w-10`} />
                </View>

                {/* Content */}
                {isLoading ? (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <ActivityIndicator size="large" color="#10b981" />
                    </View>
                ) : (
                    <Animated.ScrollView 
                        contentContainerStyle={tw`py-10 pb-32`} 
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: Platform.OS !== 'web' }
                        )}
                        scrollEventThrottle={16}
                    >
                        {frontendSkills.length > 0 && <MarqueeRow skills={frontendSkills} title="Frontend Skills" direction="left" speedMultiplier={40} />}
                        {backendSkills.length > 0 && <MarqueeRow skills={backendSkills} title="Backend Skills" direction="right" speedMultiplier={45} />}
                        {appSkills.length > 0 && <MarqueeRow skills={appSkills} title="App Skills" direction="left" speedMultiplier={42} />}
                        
                        {/* Fallback if database has no app skills yet to show the feature */}
                        {appSkills.length === 0 && (
                            <MarqueeRow 
                                skills={[
                                    { title: 'React Native', iconName: 'FaReact', color: '#61dafb' },
                                    { title: 'Expo', iconName: 'FaApple', color: '#fff' },
                                    { title: 'Android', iconName: 'FaAndroid', color: '#3DDC84' },
                                ]} 
                                title="App Skills" 
                                direction="left" 
                                speedMultiplier={42} 
                            />
                        )}
                    </Animated.ScrollView>
                )}
            </View>
            <BottomNavigation translateY={tabBarTranslateY} />
        </SafeScreen>
    );
}
