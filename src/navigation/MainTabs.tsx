import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SteamBottomBar from '../components/SteamBottomBar';
import StoreScreen from '../screens/StoreScreen';
import WishlistScreen from '../screens/WishlistScreen';
import NewsScreen from '../screens/NewsScreen';
import type { ShopStackParams, TabParams } from './types';

const Tab = createBottomTabNavigator<TabParams>();
const ShopStack = createNativeStackNavigator<ShopStackParams>();

function ShopNavigator() {
  return (
    <ShopStack.Navigator screenOptions={{ headerShown: false }}>
      <ShopStack.Screen name="Store" component={StoreScreen} />
      <ShopStack.Screen name="Wishlist" component={WishlistScreen} />
    </ShopStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <SteamBottomBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Shop" component={ShopNavigator} />
      <Tab.Screen name="News" component={NewsScreen} />
    </Tab.Navigator>
  );
}
