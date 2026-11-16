import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';
import { gradients } from '@/theme/colors';

type Props = {
  /** Polygon points as fractions of the screen size, e.g. [[1, 0.2], [1, 1], [0, 1]]. */
  points: [number, number][];
  /** Height to cover; defaults to the full window height. */
  height?: number;
};

/** The blue diagonal shape that sits behind the content in the design. */
export function DiagonalBackdrop({ points, height }: Props) {
  const { width, height: windowHeight } = useWindowDimensions();
  const h = height ?? windowHeight;
  const pts = points.map(([x, y]) => `${x * width},${y * h}`).join(' ');

  return (
    <Svg width={width} height={h} style={[StyleSheet.absoluteFill, { height: h }]} pointerEvents="none">
      <Defs>
        <LinearGradient id="backdrop" x1="1" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={gradients.backdrop[0]} />
          <Stop offset="1" stopColor={gradients.backdrop[1]} />
        </LinearGradient>
      </Defs>
      <Polygon points={pts} fill="url(#backdrop)" />
    </Svg>
  );
}
