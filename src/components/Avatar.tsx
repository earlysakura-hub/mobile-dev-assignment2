import React from 'react';
import { Image, Pressable } from 'react-native';
import { ART } from '../data/catalog';

export default function Avatar({ size = 38, onPress }: { size?: number; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} accessibilityLabel="Account">
      <Image source={ART.avatar} style={{ width: size, height: size }} />
    </Pressable>
  );
}
