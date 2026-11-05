import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import StoreHeader from '../components/StoreHeader';
import FeaturedCard from '../components/FeaturedCard';
import { ART, GAMES } from '../data/catalog';
import { demoAlert, formatPrice } from '../constants/theme';
import type { ShopStackParams } from '../navigation/types';
import { s } from '../styles/styles';

export default function StoreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ShopStackParams>>();
  const openAccount = () => navigation.getParent()?.getParent()?.dispatch(CommonActions.navigate('Account'));
  return (
    <View style={s.screen}>
      <StoreHeader onWishlist={() => navigation.navigate('Wishlist')} onAccount={openAccount} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.sectionHeading}>Featured &amp; Recommended</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hCarousel}>
          <FeaturedCard game={GAMES[2]} />
          <FeaturedCard game={GAMES[0]} />
        </ScrollView>
        <Text style={[s.sectionHeading, { marginTop: 30 }]}>Discounts &amp; Events</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.hCarousel}>
          <Pressable onPress={() => demoAlert('Midweek Deal')} style={s.dealCard}>
            <Image source={ART.leaf} style={s.dealImage} />
            <Text style={s.dealLabel}>MIDWEEK DEAL</Text>
          </Pressable>
          <Pressable onPress={() => demoAlert('Publisher Sale')} style={s.dealCard}>
            <Image source={ART.ace} style={s.dealImage} resizeMode="cover" />
            <Text style={s.dealLabel}>PUBLISHER SALE</Text>
          </Pressable>
        </ScrollView>
        <Text style={[s.sectionHeading, { marginTop: 25 }]}>Recommended for You</Text>
        <Pressable style={s.recommendRow} onPress={() => navigation.navigate('Wishlist')}>
          <Image source={ART.wukong} style={s.recommendImage} />
          <View style={{ flex: 1 }}>
            <Text style={s.recommendTitle}>Black Myth: Wukong</Text>
            <Text style={s.featureReviews}>Very Positive</Text>
            <Text style={s.featurePrice}>{formatPrice(79.99)}</Text>
          </View>
        </Pressable>
        <Text style={s.bottomHint}>Steam Store UI Demo</Text>
      </ScrollView>
    </View>
  );
}
