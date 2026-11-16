import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';
import { colors, gradients } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { useCartStore } from '@/store/cartStore';
import { categoryIcons, formatPrice, images, products } from '@/data/products';
import { Category, Product } from '@/types';
import { SlantedCard } from '@/components/ui/SlantedCard';
import { GradientIconButton } from '@/components/ui/GradientButton';
import { DiagonalBackdrop } from '@/components/ui/DiagonalBackdrop';

const H_PADDING = 20;
const GAP = 16;

const categories: ('all' | Category)[] = ['all', 'electric', 'road', 'mountain', 'helmet'];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all');
  const favorites = useCartStore((s) => s.favorites);
  const toggleFavorite = useCartStore((s) => s.toggleFavorite);

  const contentWidth = width - H_PADDING * 2;
  const cardWidth = (contentWidth - GAP) / 2;

  const filtered =
    activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory);
  const leftColumn = filtered.filter((_, i) => i % 2 === 0);
  const rightColumn = filtered.filter((_, i) => i % 2 === 1);

  const renderCard = (product: Product, index: number) => (
    <Animated.View key={product.id} entering={FadeInUp.delay(index * 80).duration(400)}>
      <ProductCard
        product={product}
        width={cardWidth}
        isFavorite={favorites.includes(product.id)}
        onPress={() => router.push(`/product/${product.id}`)}
        onFavorite={() => toggleFavorite(product.id)}
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <DiagonalBackdrop points={[[1, 0.22], [1, 1], [0, 1], [0, 0.88]]} />

      <SafeAreaView style={styles.flex} edges={['top']}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Bike</Text>
          <GradientIconButton icon="search" />
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Featured banner */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <SlantedCard width={contentWidth} height={230} bottomSlant={45} radius={24}>
              <Image source={images.electric} style={styles.bannerImage} resizeMode="contain" />
              <Text style={styles.bannerText}>30% Off</Text>
            </SlantedCard>
          </Animated.View>

          {/* Categories — each button sits a little higher than the one before */}
          <View style={styles.categories}>
            {categories.map((cat, i) => (
              <CategoryButton
                key={cat}
                category={cat}
                active={activeCategory === cat}
                offset={i * 10}
                onPress={() => setActiveCategory(cat)}
              />
            ))}
          </View>

          {/* Product grid — right column is raised to follow the diagonal */}
          {filtered.length === 0 ? (
            <Text style={styles.empty}>No products in this category yet.</Text>
          ) : (
            <View style={styles.grid}>
              <View style={[styles.column, { marginTop: 40 }]}>
                {leftColumn.map((p, i) => renderCard(p, i * 2))}
              </View>
              <View style={styles.column}>{rightColumn.map((p, i) => renderCard(p, i * 2 + 1))}</View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function CategoryButton({
  category,
  active,
  offset,
  onPress,
}: {
  category: 'all' | Category;
  active: boolean;
  offset: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.categoryShadow, { transform: [{ translateY: -offset }] }]}
    >
      <LinearGradient
        colors={active ? gradients.primary : gradients.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.categoryBtn}
      >
        {category === 'all' ? (
          <Text style={styles.categoryAll}>All</Text>
        ) : (
          <Image
            source={categoryIcons[category]}
            style={[styles.categoryIcon, { opacity: active ? 1 : 0.8 }]}
            resizeMode="contain"
          />
        )}
      </LinearGradient>
    </Pressable>
  );
}

function ProductCard({
  product,
  width,
  isFavorite,
  onPress,
  onFavorite,
}: {
  product: Product;
  width: number;
  isFavorite: boolean;
  onPress: () => void;
  onFavorite: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.9 }}>
      <SlantedCard width={width} height={230} topSlant={24} bottomSlant={24} radius={22}>
        <Pressable onPress={onFavorite} hitSlop={10} style={styles.heart}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? colors.primary : colors.white}
          />
        </Pressable>

        <Image source={product.image} style={styles.cardImage} resizeMode="contain" />

        <View style={styles.cardInfo}>
          <Text style={styles.cardLabel}>{product.label}</Text>
          <Text style={styles.cardName} numberOfLines={1}>
            {product.brand} - {product.name}
          </Text>
          <Text style={styles.cardPrice}>{formatPrice(product.price)}</Text>
        </View>
      </SlantedCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PADDING,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
  scroll: { paddingHorizontal: H_PADDING, paddingBottom: 130 },

  bannerImage: { width: '100%', height: 150, marginTop: 16 },
  bannerText: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    fontFamily: fonts.bold,
    fontSize: 26,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 8,
  },
  categoryShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 10,
  },
  categoryBtn: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryAll: { fontFamily: fonts.medium, fontSize: 15, color: colors.white },
  categoryIcon: { width: 30, height: 30 },

  grid: { flexDirection: 'row', gap: GAP },
  column: { flex: 1, gap: GAP },
  empty: {
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },

  heart: { position: 'absolute', top: 14, right: 14, zIndex: 1 },
  cardImage: { width: '84%', height: 100, alignSelf: 'center', marginTop: 40 },
  cardInfo: { position: 'absolute', left: 16, right: 12, bottom: 26 },
  cardLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary },
  cardName: { fontFamily: fonts.bold, fontSize: 15, color: colors.text, marginTop: 2 },
  cardPrice: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
