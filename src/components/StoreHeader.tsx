import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Avatar from './Avatar';
import { C, demoAlert } from '../constants/theme';
import { s } from '../styles/styles';

export default function StoreHeader({ showBack = false, onBack, onWishlist, onAccount }: {
  showBack?: boolean;
  onBack?: () => void;
  onWishlist: () => void;
  onAccount: () => void;
}) {
  return (
    <View style={s.storeHeader}>
      <View style={s.storeHeaderRow}>
        {showBack && (
          <Pressable onPress={onBack} style={s.backButton} accessibilityLabel="Back">
            <Ionicons name="chevron-back" color={C.text} size={28} />
          </Pressable>
        )}
        <Pressable style={s.steamLogoBox} onPress={() => demoAlert('Steam Store')}>
          <MaterialCommunityIcons name="steam" size={27} color="#7e838c" />
          <Text style={s.steamLogoText}>STEAM</Text>
          <View style={{ flex: 1 }} />
          <Ionicons name="search" color="#9fa5ad" size={25} />
        </Pressable>
        <Pressable style={s.ellipsis} onPress={() => demoAlert('More options')}>
          <Ionicons name="ellipsis-vertical" size={24} color={C.muted} />
        </Pressable>
        <Avatar onPress={onAccount} />
      </View>
      <View style={s.storeLinks}>
        <Pressable onPress={() => demoAlert('Store menu')}>
          <Text style={s.storeLinkText}>MENU⌄</Text>
        </Pressable>
        <Pressable onPress={onWishlist}>
          <Text style={s.storeLinkText}>WISHLIST</Text>
        </Pressable>
        <Pressable onPress={() => demoAlert('Wallet')}>
          <Text style={s.storeLinkText}>WALLET <Text style={{ color: C.blue }}>(CDN$ 0.00)</Text></Text>
        </Pressable>
      </View>
    </View>
  );
}
