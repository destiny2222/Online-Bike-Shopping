import { useId } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { gradients } from '@/theme/colors';
import { slantedRectPath } from './shapes';

type Props = {
  width: number;
  height: number;
  topSlant?: number;
  bottomSlant?: number;
  radius?: number;
  colors?: readonly [string, string];
  opacity?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/** A card with sloped top/bottom edges, filled with a gradient and a thin light border. */
export function SlantedCard({
  width,
  height,
  topSlant = 0,
  bottomSlant = 0,
  radius = 24,
  colors = gradients.card,
  opacity = 0.85,
  style,
  children,
}: Props) {
  const id = useId().replace(/:/g, '');
  const d = slantedRectPath(width, height, { topSlant, bottomSlant, radius });

  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={`fill${id}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors[0]} stopOpacity={opacity} />
            <Stop offset="1" stopColor={colors[1]} stopOpacity={opacity} />
          </LinearGradient>
          <LinearGradient id={`stroke${id}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.25} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        <Path d={d} fill={`url(#fill${id})`} stroke={`url(#stroke${id})`} strokeWidth={1.5} />
      </Svg>
      {children}
    </View>
  );
}
