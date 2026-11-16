import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '@/store/cartStore';
import { colors, gradients } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

type IconName = keyof typeof Ionicons.glyphMap;

function CartBadge() {
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  if (totalItems === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{totalItems > 9 ? '9+' : totalItems}</Text>
    </View>
  );
}

/** Inactive tabs are a plain icon; the active tab is a raised, slanted gradient tile. */
function TabIcon({ name, focused, badge }: { name: IconName; focused: boolean; badge?: boolean }) {
  if (!focused) {
    return (
      <View>
        <Ionicons name={name} size={24} color={colors.textSecondary} />
        {badge && <CartBadge />}
      </View>
    );
  }
  return (
    <View style={styles.activeWrap}>
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.activeTile}
      >
        <View style={styles.unskew}>
          <Ionicons name={name} size={26} color={colors.white} />
          {badge && <CartBadge />}
        </View>
      </LinearGradient>
    </View>
  );
}

const tab = (title: string, icon: IconName, badge = false) => ({
  title,
  tabBarIcon: ({ focused }: { focused: boolean }) => (
    <TabIcon name={icon} focused={focused} badge={badge} />
  ),
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.tabBar, { height: 70 + insets.bottom }],
        tabBarItemStyle: styles.tabItem,
        tabBarIconStyle: styles.tabIcon,
        tabBarBackground: () => (
          <LinearGradient
            colors={gradients.tabBar}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.tabBarBg}
          />
        ),
      }}
    >
      <Tabs.Screen name="index" options={tab('Home', 'bicycle')} />
      <Tabs.Screen name="map" options={tab('Map', 'map')} />
      <Tabs.Screen name="cart" options={tab('Cart', 'cart', true)} />
      <Tabs.Screen name="profile" options={tab('Profile', 'person')} />
      <Tabs.Screen name="documents" options={tab('Documents', 'document-text')} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  tabBarBg: { flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  tabItem: { paddingTop: 14, overflow: 'visible' },
  tabIcon: { width: 64, height: 44, overflow: 'visible' },

  activeWrap: {
    marginTop: -22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  activeTile: {
    width: 64,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ skewY: '-12deg' }],
  },
  unskew: { transform: [{ skewY: '12deg' }] },

  badge: {
    position: 'absolute',
    right: -10,
    top: -6,
    backgroundColor: colors.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: colors.white, fontSize: 10, fontFamily: fonts.bold },
});
