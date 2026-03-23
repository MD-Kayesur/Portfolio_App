
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions,
    Image,
    StyleSheet,
} from 'react-native';
import tw from 'twrnc';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashScreenProps {
    onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const text = "MD_Kayesur";
    const characters = text.split("");

    // Animation values
    const moveX = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // 1. Horizontal movement - very slow sweep across the screen for "continuous" feel
        Animated.timing(moveX, {
            toValue: SCREEN_WIDTH + 400,
            duration: 7000, // Even slower travers for better visibility of the wave
            useNativeDriver: true,
        }).start(() => {
            onComplete();
        });

        // 2. High-speed, high-frequency wave ripple (continuous undulation)
        Animated.loop(
            Animated.timing(waveAnim, {
                toValue: 1,
                duration: 900, // Faster ripple for "continuous" liquid energy
                useNativeDriver: true,
            })
        ).start();

        // 3. Overall splash screen fade out at the very end
        Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            delay: 6000,
            useNativeDriver: true,
        }).start();

        return () => {
            moveX.stopAnimation();
            waveAnim.stopAnimation();
            opacity.stopAnimation();
        };
    }, []);

    return (
        <Animated.View
            style={[
                styles.overlay,
                { opacity }
            ]}
        >
            {/* Static Profile Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={require("../assets/images/kayes.jpg")}
                    style={styles.image}
                />
            </View>

            {/* Individual characters making an intense "Sea Wave" ripple */}
            <View style={styles.textTrack}>
                <Animated.View
                    style={{
                        flexDirection: 'row',
                        transform: [{ translateX: moveX }]
                    }}
                >
                    {characters.map((char, index) => {
                        // Maximize the "continuous" ripple effect:
                        const amplitude = 55; // Deep wave
                        const frequency = 1.2; // Tighter, more complex wave flow

                        const translateY = waveAnim.interpolate({
                            inputRange: [0, 0.25, 0.5, 0.75, 1],
                            outputRange: [
                                Math.sin((index * frequency) - (0 * 2 * Math.PI)) * amplitude,
                                Math.sin((index * frequency) - (0.25 * 2 * Math.PI)) * amplitude,
                                Math.sin((index * frequency) - (0.5 * 2 * Math.PI)) * amplitude,
                                Math.sin((index * frequency) - (0.75 * 2 * Math.PI)) * amplitude,
                                Math.sin((index * frequency) - (1 * 2 * Math.PI)) * amplitude,
                            ],
                        });

                        return (
                            <Animated.Text
                                key={index}
                                style={[
                                    tw`text-5xl font-black text-red-600 px-0.5`,
                                    {
                                        transform: [{ translateY }],
                                        textShadowColor: 'rgba(220, 38, 38, 0.4)',
                                        textShadowOffset: { width: 0, height: 8 },
                                        textShadowRadius: 15,
                                    }
                                ]}
                            >
                                {char}
                            </Animated.Text>
                        );
                    })}
                </Animated.View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        shadowColor: "#dc2626",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 35,
        elevation: 15,
        marginBottom: 90,
    },
    image: {
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 6,
        borderColor: '#fee2e2',
    },
    textTrack: {
        position: 'absolute',
        bottom: SCREEN_HEIGHT * 0.28,
        width: '100%',
        alignItems: 'flex-start',
    },
});
