import React from 'react';
import { Pressable, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, demoAlert } from '../constants/theme';
import { s } from '../styles/styles';

export default function SteamBottomBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const active = state.routes[state.index].name;
  const actions: { icon: keyof typeof Ionicons.glyphMap; selected: boolean; onPress: () => void; label: string }[] = [
    { icon: 'pricetag', selected: active === 'Shop', onPress: () => navigation.navigate('Shop', { screen: 'Store' }), label: 'Store' },
    { icon: 'newspaper', selected: active === 'News', onPress: () => navigation.navigate('News'), label: 'News' },
    { icon: 'shield', selected: false, onPress: () => demoAlert('Steam Guard'), label: 'Steam Guard' },
    { icon: 'notifications', selected: false, onPress: () => demoAlert('Notifications'), label: 'Notifications' },
    { icon: 'menu', selected: false, onPress: () => navigation.dispatch(CommonActions.navigate('Account')), label: 'Account menu' },
  ];
  return (
    <View style={[s.bottomBar, { paddingBottom: insets.bottom, height: 58 + insets.bottom }]}>
      {actions.map((action) => (
        <Pressable key={action.label} onPress={action.onPress} style={s.bottomIcon} accessibilityLabel={action.label}>
          <Ionicons name={action.icon} size={25} color={action.selected ? C.blue : '#d8dce1'} />
        </Pressable>
      ))}
    </View>
  );
}
