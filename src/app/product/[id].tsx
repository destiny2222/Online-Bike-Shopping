import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, gradients } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, products } from '@/data/products';
import { GradientButton, GradientIconButton } from '@/components/ui/GradientButton';
import { DiagonalBackdrop } from '@/components/ui/DiagonalBackdrop';

type Tab = 'description' | 'specification';

const SPECIFICATION =
  '• Frame: Lugged steel\n• Drivetrain: 16-speed Shimano Claris\n• Brakes: Dual-pivot caliper\n• Weight: 11.2 kg\n• Sizes: S / M / L / XL';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const addToCart = useCartStore((s) => s.addToCart);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(t);
  }, [added]);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.body}>Product not found.</Text>
      </View>
    );
  }

  const title = `${product.brand} - ${product.name}`;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <DiagonalBackdrop points={[[0.8, 0], [1, 0], [1, 1], [0, 1], [0, 0.88]]} height={470} />

      <SafeAreaView edges={['top']}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <GradientIconButton icon="chevron-back" onPress={() => router.back()} />
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(100).duration(500)}>
          <Image source={product.image} style={styles.image} resizeMode="contain" />
          <View style={styles.dots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
            ))}
          </View>
        </Animated.View>
      </SafeAreaView>

      <Animated.View entering={FadeInUp.delay(150).duration(450)} style={styles.sheetWrap}>
        <LinearGradient colors={gradients.sheet} style={styles.sheet}>
          <View style={styles.tabs}>
            {(['description', 'specification'] as const).map((tab) => {
              const active = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tab, active && styles.tabActive]}
                >
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>
                    {tab === 'description' ? 'Description' : 'Specification'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
          >
            <Animated.View key={activeTab} entering={FadeIn.duration(300)}>
              <Text style={styles.productName}>{title}</Text>
              <Text style={styles.body}>
                {activeTab === 'description' ? product.description : SPECIFICATION}
              </Text>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </Animated.View>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <GradientButton
          title={added ? 'Added ✓' : 'Add to Cart'}
          style={styles.addBtn}
          onPress={() => {
            addToCart(product);
            setAdded(true);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.text,
    marginHorizontal: 12,
  },
  image: { width: '100%', height: 250, marginTop: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 8 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { backgroundColor: colors.white },

  sheetWrap: {
    flex: 1,
    marginTop: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 28,
    paddingTop: 30,
  },
  tabs: { flexDirection: 'row', gap: 20, marginBottom: 28 },
  tab: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabActive: { backgroundColor: colors.surfaceDark, shadowOpacity: 0.1, elevation: 1 },
  tabText: { fontFamily: fonts.medium, fontSize: 15, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontFamily: fonts.semibold },

  productName: { fontFamily: fonts.bold, fontSize: 17, color: colors.text, marginBottom: 10 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 24, color: colors.textSecondary },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 24,
    backgroundColor: colors.bottomBar,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  price: { fontFamily: fonts.regular, fontSize: 24, color: colors.primary },
  addBtn: { width: 160 },
});
