import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { C } from './src/constants/theme';
import { WishlistProvider } from './src/context/WishlistContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <WishlistProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: C.header }} edges={['top']}>
          <StatusBar barStyle="light-content" />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </WishlistProvider>
    </SafeAreaProvider>
  );
}
