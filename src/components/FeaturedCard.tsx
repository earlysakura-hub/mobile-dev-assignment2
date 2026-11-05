import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { C, SCREEN_WIDTH, formatPrice } from '../constants/theme';
import type { Game } from '../data/catalog';
import { useWishlist } from '../context/WishlistContext';
import { s } from '../styles/styles';

export default function FeaturedCard({ game }: { game: Game }) {
  const { ids, toggle } = useWishlist();
  const saved = ids.includes(game.id);
  return (
    <View style={[s.featureCard, { width: SCREEN_WIDTH - 48 }]}>
      <Image source={game.image} style={s.featureImage} resizeMode="cover" />
      <View style={s.featureDetails}>
        <Text style={s.featureTitle}>{game.title}</Text>
        <Text style={s.featureReviews}>
          Very Positive <Text style={{ color: C.text }}>(6,593 Reviews)</Text>
        </Text>
        <View style={s.featureBottom}>
          <Pressable onPress={() => toggle(game.id)} style={s.wishButton}>
            <Ionicons name={saved ? 'heart' : 'heart-outline'} size={19} color={saved ? '#f2676e' : C.text} />
            <Text style={s.smallButtonText}>{saved ? 'Wishlisted' : 'Wishlist'}</Text>
          </Pressable>
          <Text style={s.featurePrice}>{formatPrice(game.price)}</Text>
        </View>
      </View>
    </View>
  );
}
