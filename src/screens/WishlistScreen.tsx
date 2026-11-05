import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import StoreHeader from '../components/StoreHeader';
import Avatar from '../components/Avatar';
import WishlistFooter from '../components/WishlistFooter';
import { useWishlist } from '../context/WishlistContext';
import { GAMES } from '../data/catalog';
import { C, DISPLAY_NAME, demoAlert, formatPrice } from '../constants/theme';
import type { ShopStackParams } from '../navigation/types';
import { s } from '../styles/styles';

export default function WishlistScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ShopStackParams>>();
  const { ids, remove } = useWishlist();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'rank' | 'name' | 'price'>('rank');
  const [positiveOnly, setPositiveOnly] = useState(false);
  const games = useMemo(() => {
    let result = GAMES.filter((game) => ids.includes(game.id) && game.title.toLowerCase().includes(search.toLowerCase()));
    if (positiveOnly) result = result.filter((game) => game.reviews.includes('POSITIVE'));
    if (sort === 'name') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'price') result = [...result].sort((a, b) => a.price - b.price);
    return result;
  }, [ids, search, sort, positiveOnly]);
  const nextSort = () => setSort((previous) => previous === 'rank' ? 'name' : previous === 'name' ? 'price' : 'rank');
  const sortLabel = sort === 'rank' ? 'Your Rank' : sort === 'name' ? 'Name' : 'Price (Low to High)';
  const openAccount = () => navigation.getParent()?.getParent()?.dispatch(CommonActions.navigate('Account'));
  return (
    <View style={s.screen}>
      <StoreHeader showBack onBack={() => navigation.goBack()} onWishlist={() => {}} onAccount={openAccount} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={s.wishlistIntro}>
          <Avatar size={62} onPress={openAccount} />
          <Text style={s.wishlistIntroText}>{DISPLAY_NAME.toUpperCase()}'S{ '\n' }WISHLIST</Text>
        </View>
        <View style={s.wishlistControls}>
          <TextInput
            placeholder="Search by name, tag, or category"
            placeholderTextColor="#808995"
            style={s.wishlistSearch}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          <View style={s.wishlistOptionsRow}>
            <Pressable style={[s.optionBox, { flex: 1 }]} onPress={() => setPositiveOnly((v) => !v)}>
              <Text style={s.optionText}>{positiveOnly ? 'Positive ✓' : 'Options'}　⌄</Text>
            </Pressable>
            <Pressable style={[s.optionBox, { flex: 1.7 }]} onPress={nextSort}>
              <Text style={s.optionText}><Text style={{ color: C.blue }}>Sort by:</Text> {sortLabel}　⌄</Text>
            </Pressable>
            <Pressable style={[s.optionBox, { width: 42, alignItems: 'center' }]} onPress={() => demoAlert('Share Wishlist')}>
              <Ionicons name="share-social-outline" size={23} color={C.text} />
            </Pressable>
          </View>
        </View>
        {games.length === 0 && (
          <Text style={s.emptyWishlist}>No matching games. Add a game from the Store or change your search.</Text>
        )}
        {games.map((game) => (
          <View key={game.id} style={s.wishlistCard}>
            <View style={s.wishlistCardTop}>
              {game.badge ? <Text style={s.demoBadge}>{game.badge}</Text> : <View />}
              <Pressable onPress={() => remove(game.id)} style={s.removeButton}>
                <Ionicons name="close" size={18} color="#fff" />
                <Text style={s.removeText}>remove</Text>
              </Pressable>
            </View>
            <Image source={game.image} style={s.wishlistGameImage} resizeMode="cover" />
            <Text style={s.wishlistGameTitle}>{game.title}</Text>
            <View style={s.categoryRow}>
              <Text style={s.detailMuted}>MY CATEGORIES:</Text>
              <Pressable style={s.plusButton} onPress={() => demoAlert('Categories')}><Ionicons name="add" color={C.muted} size={18} /></Pressable>
            </View>
            <Text style={s.detailMuted}>RELEASE DATE: <Text style={s.detailValue}>{game.releaseDate}</Text></Text>
            <Text style={s.detailMuted}>ENGLISH REVIEWS: <Text style={{ color: C.softBlue }}>{game.reviews}</Text></Text>
            <View style={s.cartRow}>
              <Text style={s.cartPrice}>{formatPrice(game.price)}</Text>
              <Pressable style={s.cartButton} onPress={() => demoAlert('Add to Cart')}>
                <Text style={s.cartButtonText}>Add to Cart</Text>
              </Pressable>
            </View>
          </View>
        ))}
        <WishlistFooter />
      </ScrollView>
    </View>
  );
}
