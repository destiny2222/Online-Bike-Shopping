// Palette taken from the Figma "Online Bike Shopping App" design.
export const colors = {
  background: '#242C3B',
  surface: '#323B4F',
  surfaceDark: '#28303F',
  bottomBar: '#262E3D',
  border: 'rgba(255, 255, 255, 0.12)',
  divider: 'rgba(255, 255, 255, 0.08)',

  primary: '#3D9CEA',
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textMuted: 'rgba(255, 255, 255, 0.4)',

  white: '#FFFFFF',
  black: '#000000',
  danger: '#EF4444',
};

/** Gradients are [start, end] tuples for expo-linear-gradient / svg. */
export const gradients = {
  primary: ['#34C8E8', '#4E4AF2'] as const,
  card: ['#363E51', '#191E26'] as const,
  sheet: ['#353F54', '#222834'] as const,
  tabBar: ['#363E51', '#181C24'] as const,
  backdrop: ['#37B6E9', '#4B4CED'] as const,
};
