import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { demoAlert } from '../constants/theme';
import { s } from '../styles/styles';

export default function WishlistFooter() {
  const columns = [
    ['STEAM', 'About Steam', 'Steam SSA', 'Steamworks', 'Steam Distribution', 'Gift Cards'],
    ['VALVE', 'About Valve', 'Jobs', 'Hardware', 'Recycling'],
    ['LEGAL', 'Privacy', 'Accessibility', 'Notices & Policies', 'Cookies', 'Refunds'],
    ['MORE', 'Get Steam', 'Get Mobile Apps', 'Get Support', 'My Account'],
  ];
  return (
    <View style={s.footer}>
      <View style={s.footerGrid}>
        {columns.map((column) => (
          <View key={column[0]} style={s.footerColumn}>
            <Text style={s.footerHeading}>{column[0]}</Text>
            {column.slice(1).map((label) => (
              <Pressable onPress={() => demoAlert(label)} key={label}>
                <Text style={s.footerLink}>{label}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
      <Text style={s.footerLogo}>◉ STEAM       VALVE</Text>
      <Text style={s.footerCopy}>© 2026 Valve Corporation. All rights reserved.{'\n'}This is a non-commercial student interface recreation.</Text>
    </View>
  );
}
