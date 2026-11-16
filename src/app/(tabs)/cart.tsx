import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, LinearTransition } from 'react-native-reanimated';
import { router } from 'expo-router';
import { colors, gradients } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/products';
import { CartItem } from '@/types';
import { GradientButton, GradientIconButton } from '@/components/ui/GradientButton';

const COUPONS: Record<string, number> = { BIKE30: 0.3 };

export default function CartScreen() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const [code, setCode] = useState('Bike30');
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = 0;
  const total = subtotal * (1 - discount) + deliveryFee;

  const applyCoupon = () => {
    const pct = COUPONS[code.trim().toUpperCase()];
    if (pct) setDiscount(pct);
    else Alert.alert('Invalid code', 'That coupon code is not valid.');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <GradientIconButton icon="chevron-back" onPress={() => router.back()} />
          <Text style={styles.headerTitle}>My Shopping Cart</Text>
          <View style={{ width: 44 }} />
        </Animated.View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <GradientButton title="Start Shopping" onPress={() => router.navigate('/')} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {items.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInRight.delay(index * 80).duration(400)}
                layout={LinearTransition}
              >
                <CartRow
                  item={item}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                />
              </Animated.View>
            ))}

            <Text style={styles.shipping}>Your cart qualifies for free shipping</Text>

            <View style={styles.coupon}>
              <TextInput
                style={styles.couponInput}
                value={code}
                onChangeText={setCode}
                placeholder="Coupon code"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
              />
              <GradientButton title="Apply" onPress={applyCoupon} style={styles.applyBtn} />
            </View>

            <SummaryRow label="Subtotal:" value={formatPrice(subtotal)} />
            <SummaryRow label="Delivery Fee:" value={formatPrice(deliveryFee)} />
            <SummaryRow label="Discount:" value={`${Math.round(discount * 100)}%`} />
            <View style={[styles.summaryRow, { marginTop: 10 }]}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.total}>{formatPrice(total)}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.checkout, pressed && { opacity: 0.85 }]}
              onPress={() => Alert.alert('Checkout', 'Checkout is coming soon.')}
            >
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.checkoutArrow}
              >
                <Ionicons name="chevron-forward" size={22} color={colors.white} />
              </LinearGradient>
              <Text style={styles.checkoutText}>Checkout</Text>
            </Pressable>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

function CartRow({
  item,
  onIncrease,
  onDecrease,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <View style={styles.row}>
      <LinearGradient
        colors={gradients.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.thumb}
      >
        <Image source={item.image} style={styles.thumbImage} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1}>
          {item.brand} - {item.name}
        </Text>
        <View style={styles.rowBottom}>
          <Text style={styles.rowPrice}>{formatPrice(item.price)}</Text>
          <View style={styles.qty}>
            <Pressable onPress={onIncrease} hitSlop={6}>
              <LinearGradient colors={gradients.primary} style={styles.qtyBtn}>
                <Ionicons name="add" size={18} color={colors.white} />
              </LinearGradient>
            </Pressable>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <Pressable onPress={onDecrease} hitSlop={6} style={[styles.qtyBtn, styles.qtyBtnDark]}>
              <Ionicons name="remove" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
  scroll: { paddingHorizontal: 20, paddingBottom: 130 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  thumb: {
    width: 100,
    height: 90,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumbImage: { width: 80, height: 64 },
  rowInfo: { flex: 1, marginLeft: 20, height: 90, justifyContent: 'space-between', paddingVertical: 6 },
  rowName: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowPrice: { fontFamily: fonts.regular, fontSize: 13, color: colors.primary },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: { width: 26, height: 26, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  qtyBtnDark: { backgroundColor: colors.surface },
  qtyText: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary, minWidth: 12, textAlign: 'center' },

  shipping: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 24,
  },
  coupon: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceDark,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 24,
  },
  couponInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
  },
  applyBtn: { width: 120 },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  summaryLabel: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  summaryValue: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary },
  total: { fontFamily: fonts.bold, fontSize: 18, color: colors.primary },

  checkout: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 28,
    backgroundColor: colors.surfaceDark,
    borderRadius: 10,
    paddingRight: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  checkoutArrow: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
  },
  checkoutText: { fontFamily: fonts.medium, fontSize: 17, color: colors.textSecondary },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 80 },
  emptyText: { fontFamily: fonts.regular, color: colors.textSecondary, fontSize: 16 },
});
