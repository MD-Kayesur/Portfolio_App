
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
    const text = "App_Developer";
    const characters = text.split("");

    // Animation values
    const bounceValues = useRef(characters.map(() => new Animated.Value(0))).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const imgScale = useRef(new Animated.Value(1)).current;
    const imgOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Start cascading bounce animations for each character
        const animations = characters.map((_, index) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(index * 150),
                    Animated.timing(bounceValues[index], {
                        toValue: 1,
                        duration: 350,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceValues[index], {
                        toValue: 0,
                        duration: 350,
                        useNativeDriver: true,
                    }),
                ])
            );
        });

        // Run all animations in parallel
        animations.forEach(anim => anim.start());

        // Final exit sequence: Image zooms and vanishes (Total time: 3 seconds)
        const timeout = setTimeout(() => {
            // Simultaneous image zoom + vanish AND overall fade
            Animated.parallel([
                Animated.timing(imgScale, {
                    toValue: 2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(imgOpacity, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ]).start(() => {
                onComplete();
            });
        }, 2000); // 2s delay + 1s animation = 3s total

        return () => {
            clearTimeout(timeout);
            bounceValues.forEach(val => val.stopAnimation());
            opacity.stopAnimation();
            imgScale.stopAnimation();
            imgOpacity.stopAnimation();
        };
    }, []);

    return (
        <Animated.View
            style={[
                styles.overlay,
                { opacity }
            ]}
        >
            {/* Profile Image with Zoom and Vanish logic */}
            <Animated.View style={[
                styles.imageContainer,
                {
                    transform: [{ scale: imgScale }],
                    opacity: imgOpacity
                }
            ]}>
                <Image
                    source={require("../assets/images/kayes.jpg")}
                    style={styles.image}
                />
            </Animated.View>

            {/* Bouncing Text logic */}
            <View style={styles.textContainer}>
                {characters.map((char, index) => {
                    const translateY = bounceValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -25], // Bounce distance
                    });

                    return (
                        <Animated.Text
                            key={index}
                            style={[
                                styles.bouncingText,
                                { transform: [{ translateY }] }
                            ]}
                        >
                            {char}
                        </Animated.Text>
                    );
                })}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fca5a5',
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        marginBottom: 40,
    },
    image: {
        width: 240,
        height: 240,
        borderRadius: 120,
    },
    textContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    bouncingText: {
        fontSize: 40,
        color: '#7f1d1d',
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0,0,0,0.15)',
        textShadowOffset: { width: 0, height: 5 },
        textShadowRadius: 1,
    },
});
