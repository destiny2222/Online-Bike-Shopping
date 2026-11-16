import { useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { images } from '@/data/products';
import { DiagonalBackdrop } from '@/components/ui/DiagonalBackdrop';

// Must match `imageWidth` of expo-splash-screen in app.json so the handoff is seamless.
const NATIVE_BIKE_WIDTH = 240;
const BIKE_RATIO = 834 / 1202; // height / width of peugeot-lr01.png

const TOTAL_DURATION = 2600;

/**
 * Full-screen intro shown over the app on launch. It starts exactly like the
 * native splash (bike centred on the dark background), then animates:
 * backdrop sweeps in → bike pops & does a wheelie → bike rides off → fade out.
 */
export function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const { width } = useWindowDimensions();

  const backdropX = useSharedValue(width);
  const bikeScale = useSharedValue(1);
  const bikeRotate = useSharedValue(0);
  const bikeX = useSharedValue(0);
  const speedLines = useSharedValue(0);
  const titleIn = useSharedValue(0);
  const overlay = useSharedValue(1);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    // 1. Blue diagonal sweeps in from the right.
    backdropX.value = withTiming(0, { duration: 600, easing: ease });

    // 2. Bike pops up a little.
    bikeScale.value = withSequence(
      withTiming(1.12, { duration: 350, easing: ease }),
      withSpring(1.05, { damping: 8, stiffness: 140 })
    );

    // 3. Title slides up.
    titleIn.value = withDelay(350, withTiming(1, { duration: 500, easing: ease }));

    // 4. Wheelie: lift the front wheel, then drop back with a bounce.
    bikeRotate.value = withDelay(
      900,
      withSequence(
        withTiming(-12, { duration: 300, easing: Easing.out(Easing.quad) }),
        withSpring(0, { damping: 6, stiffness: 160 })
      )
    );

    // 5. Ride off to the right with speed lines trailing.
    speedLines.value = withDelay(1600, withTiming(1, { duration: 250 }));
    bikeX.value = withDelay(
      1650,
      withTiming(width * 1.4, { duration: 650, easing: Easing.in(Easing.cubic) })
    );
    titleIn.value = withDelay(1700, withTiming(0, { duration: 400 }));

    // 6. Fade the whole overlay away to reveal the app.
    overlay.value = withDelay(2200, withTiming(0, { duration: 400 }));

    const t = setTimeout(onFinish, TOTAL_DURATION);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlay.value }));
  const backdropStyle = useAnimatedStyle(() => ({ transform: [{ translateX: backdropX.value }] }));
  const bikeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: bikeX.value },
      { scale: bikeScale.value },
      { rotate: `${bikeRotate.value}deg` },
    ],
  }));
  const linesStyle = useAnimatedStyle(() => ({
    opacity: speedLines.value,
    transform: [{ scaleX: speedLines.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleIn.value,
    transform: [{ translateY: (1 - titleIn.value) * 24 }],
  }));

  const bikeWidth = NATIVE_BIKE_WIDTH;
  const bikeHeight = bikeWidth * BIKE_RATIO;

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.container, overlayStyle]}
      // Hide the native splash only once this identical-looking view is on screen.
      onLayout={() => SplashScreen.hide()}
      pointerEvents="none"
    >
      <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
        <DiagonalBackdrop points={[[1, 0.25], [1, 1], [0, 1], [0, 0.85]]} />
      </Animated.View>

      <View style={styles.center}>
        <Animated.View style={[{ width: bikeWidth, height: bikeHeight }, styles.bikePivot, bikeStyle]}>
          <Animated.View style={[styles.lines, linesStyle]}>
            <View style={[styles.line, { width: 90 }]} />
            <View style={[styles.line, { width: 60, marginLeft: 30 }]} />
            <View style={[styles.line, { width: 110, marginLeft: -10 }]} />
          </Animated.View>
          <Animated.Image source={images.peugeot} style={styles.bike} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={[styles.titleWrap, titleStyle]}>
          <Text style={styles.title}>Choose Your Bike</Text>
          <Text style={styles.subtitle}>Online Bike Shopping</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, zIndex: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // Rotate around the rear wheel so the front lifts like a wheelie.
  bikePivot: { transformOrigin: '22% 85%' },
  bike: { width: '100%', height: '100%' },
  lines: {
    position: 'absolute',
    right: '100%',
    top: '35%',
    gap: 14,
    transformOrigin: 'right',
  },
  line: { height: 3, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.45)' },
  titleWrap: { position: 'absolute', bottom: '22%', alignItems: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary, marginTop: 4 },
});
