import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Avatar from '../components/Avatar';
import { NEWS } from '../data/catalog';
import { C, demoAlert } from '../constants/theme';
import type { TabParams } from '../navigation/types';
import { s } from '../styles/styles';

export default function NewsScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<TabParams>>();
  const [category, setCategory] = useState<'YOUR NEWS' | 'UPCOMING' | 'FEATURED'>('YOUR NEWS');
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const openAccount = () => navigation.getParent()?.dispatch(CommonActions.navigate('Account'));
  const visibleNews = category === 'UPCOMING' ? [NEWS[1]] : category === 'FEATURED' ? [NEWS[0]] : NEWS;
  return (
    <View style={s.screen}>
      <View style={s.newsHeader}>
        <Text style={s.newsHeading}>NEWS</Text>
        <Pressable onPress={() => demoAlert('News menu')}>
          <Ionicons name="ellipsis-vertical" color={C.muted} size={24} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Avatar onPress={openAccount} />
      </View>
      <View style={s.newsTabs}>
        <Pressable onPress={() => demoAlert('News settings')}><Ionicons name="settings" color={C.text} size={20} /></Pressable>
        <Pressable onPress={() => demoAlert('News search')}><Ionicons name="search" color={C.text} size={20} /></Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 22, alignItems: 'center' }}>
          {(['YOUR NEWS', 'UPCOMING', 'FEATURED'] as const).map((name) => (
            <Pressable key={name} onPress={() => setCategory(name)} style={[s.newsTab, category === name && s.newsTabActive]}>
              <Text style={[s.newsTabText, category === name && { color: C.blue }]}>
                {name}{name === 'UPCOMING' ? '  0' : ''}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={s.today}>TODAY</Text>
        {visibleNews.map((item) => {
          const liked = likedIds.includes(item.id);
          return (
            <View key={item.id} style={s.newsCard}>
              <Image source={item.image} style={s.newsImage} resizeMode="cover" />
              <Text style={s.newsGame}>🟥  {item.game}</Text>
              <Text style={s.newsTitle}>{item.title}</Text>
              <Text style={s.newsDescription}>{item.description}</Text>
              <Text style={s.newsTime}>{item.time}</Text>
              <View style={s.newsActions}>
                <Pressable onPress={() => setLikedIds((old) => liked ? old.filter((x) => x !== item.id) : [...old, item.id])} style={s.newsAction}>
                  <Ionicons name={liked ? 'thumbs-up' : 'thumbs-up-outline'} color={liked ? C.blue : '#8e939c'} size={20} />
                  <Text style={s.newsActionText}>{(item.id === 'apex' ? 6 : 2) + (liked ? 1 : 0)}</Text>
                </Pressable>
                <Pressable onPress={() => demoAlert('Comments')} style={s.newsAction}>
                  <Ionicons name="chatbubble" color="#8e939c" size={20} />
                  <Text style={s.newsActionText}>1</Text>
                </Pressable>
                <Pressable onPress={() => demoAlert('More news options')} style={s.newsAction}>
                  <Ionicons name="ellipsis-horizontal-circle" color="#8e939c" size={22} />
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
