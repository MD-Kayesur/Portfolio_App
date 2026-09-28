import React, { useState, useEffect, useRef } from 'react';
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
    PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import Svg, {
    Defs,
    ClipPath,
    Polygon,
    LinearGradient,
    RadialGradient,
    Stop,
    G,
    Circle,
} from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    useDerivedValue,
    withSpring,
    SharedValue,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Coordinates measured for the 640x640 photo-no-eyes.png
const EYES = [
    {
        points:
            '255.4,199.4 257.6,196.8 261,194.9 265,194.3 269,194.7 272.6,196 275.6,198 273.6,200.1 269.5,201.4 264.5,201.7 259.5,201.1',
        cx: 265.3,
        cy: 197.6,
        maxX: 3.6,
        maxUp: 1.2,
        maxDown: 3.4,
        irisR: 3.6,
        pupilR: 1.5,
    },
    {
        points:
            '298.2,193.8 300.2,190.6 303.2,187.2 306.5,185.4 310.2,185.2 313.4,186.6 315.6,189.2 314.6,191.4 311.5,192.9 307.5,193.7 303,194.6 299.8,194.7',
        cx: 308.5,
        cy: 189.2,
        maxX: 3.2,
        maxUp: 1.0,
        maxDown: 3.0,
        irisR: 3.9,
        pupilR: 1.6,
    },
];
type EyeT = (typeof EYES)[number];

const SPRING = { damping: 26, stiffness: 180, mass: 0.5, overshootClamping: true };
const clamp = (v: number) => {
    'worklet';
    return Math.max(-1, Math.min(1, v));
};

type Box = { x: number; y: number; size: number };
type Touch = { x: number; y: number };

function Iris({
    eye,
    uid,
    index,
    touch,
    active,
    box,
}: {
    eye: EyeT;
    uid: string;
    index: number;
    touch: SharedValue<Touch>;
    active: SharedValue<number>;
    box: SharedValue<Box>;
}) {
    const tx = useDerivedValue(() => {
        const s = box.value.size / 640;
        const sx = box.value.x + eye.cx * s;
        const target = active.value ? clamp((touch.value.x - sx) / (340 * s)) * eye.maxX : 0;
        return withSpring(target, SPRING);
    });

    const ty = useDerivedValue(() => {
        const s = box.value.size / 640;
        const sy = box.value.y + eye.cy * s;
        if (!active.value) return withSpring(0, SPRING);
        const normalizedY = (touch.value.y - sy) / (200 * s);
        const clampedY = clamp(normalizedY);
        // Asymmetrical vertical gaze: subtle looking up, generous looking down to reveal upper sclera
        const target = clampedY < 0 ? clampedY * eye.maxUp : clampedY * eye.maxDown;
        return withSpring(target, SPRING);
    });

    const iris = useAnimatedProps(() => ({ cx: eye.cx + tx.value, cy: eye.cy + ty.value }));
    const glint = useAnimatedProps(() => ({
        cx: eye.cx + tx.value + eye.irisR * 0.35,
        cy: eye.cy + ty.value - eye.irisR * 0.38,
    }));

    return (
        <G clipPath={`url(#${uid}clip${index})`}>
            <AnimatedCircle animatedProps={iris} r={eye.irisR} fill={`url(#${uid}iris)`} />
            <AnimatedCircle animatedProps={iris} r={eye.pupilR} fill="#050505" />
            <AnimatedCircle animatedProps={glint} r={0.75} fill="#fff" opacity={0.65} />
            {/* Soft eyelid shadows for 3D depth */}
            <Polygon points={eye.points} fill="none" stroke="#1a0f0a" strokeWidth={2.2} opacity={0.25} />
            <Polygon
                points={eye.points}
                fill="none"
                stroke="#1a0f0a"
                strokeWidth={2.0}
                opacity={0.25}
                transform="translate(0, 1)"
            />
        </G>
    );
}

const LandingHero = () => {
    const router = useRouter();
    const titles = [ 'App Developer','FrontEnd Developer', 'MERN Stack Developer','Full Stack Developer' ];
    const [displayText, setDisplayText] = useState('');
    const [titleIndex, setTitleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const uid = 'eye';
    const portraitSize = Math.min(SCREEN_WIDTH > 768 ? 320 : SCREEN_WIDTH - 64, 320);

    const portraitRef = useRef<View>(null);
    const touch = useSharedValue<Touch>({ x: 0, y: 0 });
    const active = useSharedValue(0);
    const box = useSharedValue<Box>({ x: 0, y: 0, size: portraitSize });

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

    const measure = () => {
        if (Platform.OS === 'web' && portraitRef.current) {
            const el = portraitRef.current as unknown as HTMLElement;
            if (el && typeof el.getBoundingClientRect === 'function') {
                const rect = el.getBoundingClientRect();
                box.value = { x: rect.left, y: rect.top, size: rect.width || portraitSize };
                return;
            }
        }
        portraitRef.current?.measureInWindow((x, y, w) => {
            if (w) box.value = { x, y, size: w };
        });
    };

    useEffect(() => {
        measure();
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const onMove = (e: MouseEvent) => {
                measure();
                touch.value = { x: e.clientX, y: e.clientY };
                active.value = 1;
            };
            const onTouch = (e: TouchEvent) => {
                if (e.touches && e.touches[0]) {
                    measure();
                    touch.value = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                    active.value = 1;
                }
            };
            window.addEventListener('mousemove', onMove);
            window.addEventListener('touchmove', onTouch, { passive: true });
            return () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('touchmove', onTouch);
            };
        }
    }, []);

    const pan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                measure();
                touch.value = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
                active.value = 1;
            },
            onPanResponderMove: (e) => {
                touch.value = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
                active.value = 1;
            },
            onPanResponderRelease: () => {
                active.value = 0;
            },
            onPanResponderTerminate: () => {
                active.value = 0;
            },
        })
    ).current;

    const handleDownloadCV = async () => {
        try {
            const cvUrl = "https://raw.githubusercontent.com/MD-Kayesur/Portfolio_App/main/assets/images/MD_Kayesur-Resume.pdf";
            await Linking.openURL(cvUrl);
        } catch (error) {
            console.error("Failed to download CV:", error);
        }
    };

    return (
        <View {...pan.panHandlers} style={[styles.container as ViewStyle, tw`px-6 py-12`]}>
            <View style={tw`flex-1 flex-col md:flex-row items-center justify-between`}>
                {/* Left Content */}
                <View style={tw`flex-1 mb-10 md:mb-0`}>
                    <View>
                        <Text style={[tw`text-lg font-medium font-mono mb-2 ${Platform.OS === 'web' ? 'contrast-text' : 'text-white'}`, styles.textReadability]}>
                            Hello. I'm
                        </Text>
                        <Text style={[tw`text-4xl md:text-6xl font-black font-mono mb-4 leading-tight ${Platform.OS === 'web' ? 'contrast-text' : 'text-white'}`, styles.textReadability]}>
                            MD. Kayesur Rahman
                        </Text>

                        <View style={tw`flex-row items-center mb-6`}>
                            <Text style={tw`text-purple-400 text-xl font-bold font-mono mr-2`}>
                                i am
                            </Text>
                            <View style={tw`flex-row items-center`}>
                                <Text style={tw`text-white text-xl font-bold font-mono`}>
                                    {displayText}
                                </Text>
                                {/* Blinking Cursor */}
                                <View style={[styles.cursor, tw`bg-purple-400 ml-1`]} />
                            </View>
                        </View>

                        <Text style={[tw`text-base md:text-lg font-mono mb-8 leading-relaxed max-w-xl ${Platform.OS === 'web' ? 'contrast-text' : 'text-gray-200'}`, styles.textReadability]}>
                            Front-End Developer crafting high-performance, responsive, and user-friendly web applications
                            using modern technologies, clean code, and best practices for seamless user experiences.
                        </Text>

                        {/* Navigation Row - Blog, Projects, Signup */}
                        <View style={tw`flex-row flex-wrap gap-3`}>
                            <TouchableOpacity
                                onPress={() => router.push('/blogs')}
                                activeOpacity={0.8}
                                style={[
                                    styles.heroActionBtn as ViewStyle,
                                    { backgroundColor: '#6366f1' } // indigo-500
                                ]}
                            >
                                <Ionicons name="book-outline" size={18} color="white" style={tw`mr-2`} />
                                <Text style={tw`text-white text-sm font-bold font-mono`}>Blogs</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push('/projects')}
                                activeOpacity={0.8}
                                style={[
                                    styles.heroActionBtn as ViewStyle,
                                    { backgroundColor: '#f59e0b' } // amber-500
                                ]}
                            >
                                <Ionicons name="grid-outline" size={18} color="white" style={tw`mr-2`} />
                                <Text style={tw`text-white text-sm font-bold font-mono`}>Projects</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push('/skills')}
                                activeOpacity={0.8}
                                style={[
                                    styles.heroActionBtn as ViewStyle,
                                    { backgroundColor: '#10b981' } // emerald-500
                                ]}
                            >
                                <Ionicons name="hardware-chip-outline" size={18} color="white" style={tw`mr-2`} />
                                <Text style={tw`text-white text-sm font-bold font-mono`}>Skills</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>

                {/* Right Content - Eye Tracking Profile Image */}
                <View style={styles.imageWrapper as ViewStyle}>
                    <View style={styles.imageBorder as ViewStyle}>
                        <View
                            ref={portraitRef}
                            onLayout={measure}
                            style={{
                                width: portraitSize,
                                height: portraitSize,
                                position: 'relative',
                                borderRadius: 20,
                                overflow: 'hidden',
                            }}
                        >
                            {/* Layer 1: 640x640 photo-no-eyes */}
                            <Image
                                source={require('../assets/images/photo-no-eyes.png')}
                                style={{
                                    width: portraitSize,
                                    height: portraitSize,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                }}
                                resizeMode="cover"
                            />

                            {/* Layer 2 & 3: Eye Tracking SVG Overlay */}
                            <Svg
                                width={portraitSize}
                                height={portraitSize}
                                viewBox="0 0 640 640"
                                style={StyleSheet.absoluteFillObject}
                                pointerEvents="none"
                            >
                                <Defs>
                                    {EYES.map((eye, i) => (
                                        <ClipPath id={`${uid}clip${i}`} key={i}>
                                            <Polygon points={eye.points} />
                                        </ClipPath>
                                    ))}
                                    <LinearGradient id={`${uid}sclera`} x1="0" y1="0" x2="0" y2="1">
                                        <Stop offset="0" stopColor="#6d5a50" />
                                        <Stop offset="0.4" stopColor="#b3a496" />
                                        <Stop offset="1" stopColor="#cdbfb2" />
                                    </LinearGradient>
                                    <RadialGradient id={`${uid}iris`}>
                                        <Stop offset="0" stopColor="#3b342e" />
                                        <Stop offset="0.65" stopColor="#211c18" />
                                        <Stop offset="1" stopColor="#0f0c0a" />
                                    </RadialGradient>
                                </Defs>

                                {/* Layer 2: Eye Whites */}
                                {EYES.map((eye, i) => (
                                    <Polygon key={i} points={eye.points} fill={`url(#${uid}sclera)`} />
                                ))}

                                {/* Layer 3: Moving Irises and Pupils */}
                                {EYES.map((eye, i) => (
                                    <Iris key={i} eye={eye} uid={uid} index={i} touch={touch} active={active} box={box} />
                                ))}
                            </Svg>
                        </View>
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
    heroActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    imageWrapper: {
        position: 'relative',
        padding: 10,
    },
    imageBorder: {
        borderWidth: 4,
        borderColor: '#9333ea',
        borderRadius: 30,
        padding: 8,
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        shadowColor: '#9333ea',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 8,
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
