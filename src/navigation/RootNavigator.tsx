import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import AccountScreen from '../screens/AccountScreen';
import type { RootParams } from './types';

const RootStack = createNativeStackNavigator<RootParams>();

export default function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <RootStack.Screen name="Home" component={MainTabs} />
      <RootStack.Screen name="Account" component={AccountScreen} />
    </RootStack.Navigator>
  );
}
