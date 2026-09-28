// Hero.tsx  (React Native / Expo, single component)
import React, { useRef, useEffect } from "react";
import { View, Image, Text, PanResponder, useWindowDimensions, Platform, StyleSheet } from "react-native";
import Svg, {
  Defs, ClipPath, Polygon, LinearGradient, RadialGradient, Stop, G, Circle,
} from "react-native-svg";
import Animated, {
  useSharedValue, useAnimatedProps, useDerivedValue, withSpring, SharedValue,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Coordinates are measured for your 640x640 photo.
const EYES = [
  {
    points:
      "255.4,199.4 257.6,196.8 261,194.9 265,194.3 269,194.7 272.6,196 275.6,198 273.6,200.1 269.5,201.4 264.5,201.7 259.5,201.1",
    cx: 265.3, cy: 197.6, maxX: 3.6, maxUp: 1.2, maxDown: 3.4, irisR: 3.6, pupilR: 1.5,
  },
  {
    points:
      "298.2,193.8 300.2,190.6 303.2,187.2 306.5,185.4 310.2,185.2 313.4,186.6 315.6,189.2 314.6,191.4 311.5,192.9 307.5,193.7 303,194.6 299.8,194.7",
    cx: 308.5, cy: 189.2, maxX: 3.2, maxUp: 1.0, maxDown: 3.0, irisR: 3.9, pupilR: 1.6,
  },
];
type EyeT = (typeof EYES)[number];

const SPRING = { damping: 26, stiffness: 180, mass: 0.5, overshootClamping: true };
const clamp = (v: number) => {
  "worklet";
  return Math.max(-1, Math.min(1, v));
};

type Box = { x: number; y: number; size: number };
type Touch = { x: number; y: number };

function Iris({
  eye, uid, index, touch, active, box,
}: {
  eye: EyeT; uid: string; index: number;
  touch: SharedValue<Touch>; active: SharedValue<number>; box: SharedValue<Box>;
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
    // Asymmetrical: subtle movement when looking up, generous movement when looking down to reveal upper sclera
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
      {/* soft eyelid shadow for depth */}
      <Polygon points={eye.points} fill="none" stroke="#1a0f0a" strokeWidth={2.2} opacity={0.25} />
      <Polygon points={eye.points} fill="none" stroke="#1a0f0a" strokeWidth={2.0} opacity={0.25} transform="translate(0, 1)" />
    </G>
  );
}

export default function Hero() {
  const { width } = useWindowDimensions();
  const size = Math.min(width * 0.9, 420);
  const uid = "eye";

  const portraitRef = useRef<View>(null);
  const touch = useSharedValue<Touch>({ x: 0, y: 0 });
  const active = useSharedValue(0);
  const box = useSharedValue<Box>({ x: 0, y: 0, size });

  const measure = () => {
    if (Platform.OS === "web" && portraitRef.current) {
      const el = portraitRef.current as unknown as HTMLElement;
      if (el && typeof el.getBoundingClientRect === "function") {
        const rect = el.getBoundingClientRect();
        box.value = { x: rect.left, y: rect.top, size: rect.width || size };
        return;
      }
    }
    portraitRef.current?.measureInWindow((x, y, w) => {
      if (w) box.value = { x, y, size: w };
    });
  };

  useEffect(() => {
    measure();
    if (Platform.OS === "web" && typeof window !== "undefined") {
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
      window.addEventListener("mousemove", onMove);
      window.addEventListener("touchmove", onTouch, { passive: true });
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("touchmove", onTouch);
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
      onPanResponderRelease: () => { active.value = 0; }, // eyes return to centre
      onPanResponderTerminate: () => { active.value = 0; },
    })
  ).current;

  return (
    <View
      {...pan.panHandlers}
      className="flex-1 items-center justify-center gap-8 bg-[#0b0f19] py-8 px-6"
    >
      <View className="items-center">
        <Text className="text-4xl font-extrabold text-white">MD Kayesur</Text>
        <Text className="mt-1 text-lg font-semibold text-amber-400">Full-Stack Developer</Text>
        <Text className="mt-2 text-slate-400 text-center text-sm">
          Move your cursor or touch and drag anywhere, my eyes follow.
        </Text>
      </View>

      <View
        ref={portraitRef}
        onLayout={measure}
        style={{
          width: size,
          height: size,
          position: "relative",
          borderRadius: 28,
          overflow: "hidden",
        }}
      >
        {/* Layer 1: 640x640 photo without eyes */}
        <Image
          source={require("../../assets/images/photo-no-eyes.png")}
          style={{ width: size, height: size, position: "absolute", top: 0, left: 0 }}
          resizeMode="cover"
        />

        {/* SVG Eye-tracking overlay */}
        <Svg
          width={size}
          height={size}
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

          {/* Layer 2: eye white */}
          {EYES.map((eye, i) => (
            <Polygon key={i} points={eye.points} fill={`url(#${uid}sclera)`} />
          ))}

          {/* Layer 3: black part, clipped to the eyelid shape */}
          {EYES.map((eye, i) => (
            <Iris key={i} eye={eye} uid={uid} index={i} touch={touch} active={active} box={box} />
          ))}
        </Svg>
      </View>
    </View>
  );
}