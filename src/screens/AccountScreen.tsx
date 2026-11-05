import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import Avatar from '../components/Avatar';
import { C, DISPLAY_NAME, demoAlert } from '../constants/theme';
import type { RootParams } from '../navigation/types';
import { s } from '../styles/styles';

export default function AccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootParams>>();
  const accountRows = ['Friend Activity', 'Friends', 'Groups', 'Screenshots/Videos', 'Badges', 'Inventory'];
  return (
    <View style={[s.screen, { backgroundColor: C.header }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.accountHero}>
          <Pressable onPress={() => navigation.goBack()} style={s.accountBack} accessibilityLabel="Back">
            <Ionicons name="chevron-back" color={C.text} size={30} />
          </Pressable>
          <Avatar size={82} />
          <View style={{ flex: 1, marginLeft: 17 }}>
            <Text style={s.accountName} numberOfLines={1}>{DISPLAY_NAME}</Text>
            <Pressable style={s.profileButton} onPress={() => demoAlert('View Profile')}>
              <Text style={s.profileButtonText}>View Profile</Text>
            </Pressable>
          </View>
        </View>
        <View style={s.accountStats}>
          {[['48', 'Games'], ['8', 'Friends'], ['C$ 0.00', 'Wallet']].map(([value, label]) => (
            <View key={label} style={s.statBox}>
              <Text style={s.statNumber}>{value}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
          <Pressable onPress={() => demoAlert('Add Friends')} style={s.addFriends}>
            <Ionicons name="person-add" size={21} color="#fff" />
            <Text style={s.addFriendsText}>Add friends</Text>
          </Pressable>
        </View>
        <Text style={s.myContent}>MY CONTENT</Text>
        {accountRows.map((label) => (
          <Pressable key={label} onPress={() => demoAlert(label)} style={s.accountRow}>
            <Text style={s.accountRowText}>{label}</Text>
          </Pressable>
        ))}
        {[
          ['Account Details', 'Store, Security, Family'],
          ['Change Account', DISPLAY_NAME.toLowerCase()],
          ['Sign Out', ''],
        ].map(([label, sub]) => (
          <Pressable key={label} onPress={() => demoAlert(label)} style={s.accountRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.accountRowText}>{label}</Text>
              {sub ? <Text style={s.accountSubText}>{sub}</Text> : null}
            </View>
            {label !== 'Sign Out' && <Ionicons name="chevron-forward" color={C.text} size={25} />}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
