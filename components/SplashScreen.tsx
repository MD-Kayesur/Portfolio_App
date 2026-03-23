
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

    // Create an array of Animated values for each character
    const bounceValues = useRef(characters.map(() => new Animated.Value(0))).current;
    const opacity = useRef(new Animated.Value(1)).current;

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

        // Final fade out and complete splash
        const timeout = setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }).start(() => {
                onComplete();
            });
        }, 5500);

        return () => {
            clearTimeout(timeout);
            bounceValues.forEach(val => val.stopAnimation());
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
            {/* Static Profile Image (Larger size as requested) */}
            <View style={styles.imageContainer}>
                <Image
                    source={require("../assets/images/kayes.jpg")}
                    style={styles.image}
                />
            </View>

            {/* Bouncing Text logic inspired by provided demo */}
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
        backgroundColor: '#fca5a5', // red-300
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        marginBottom: 40, // Reduced from 80 for a tighter gap
    },
    image: {
        width: 240, // Increased size from 180
        height: 240, // Increased size from 180
        borderRadius: 120, // Half of 240 for circle
    },
    textContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    bouncingText: {
        fontSize: 48,
        color: '#7f1d1d', // red-900
        fontWeight: '900',
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0,0,0,0.15)',
        textShadowOffset: { width: 0, height: 5 },
        textShadowRadius: 1,
    },
});
