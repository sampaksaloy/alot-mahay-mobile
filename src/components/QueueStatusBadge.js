import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../core/constants/colors';

export default function QueueStatusBadge({ status }) {
  return (
    <View style={[styles.badge, { backgroundColor: COLORS.status[status] ?? COLORS.textSecondary }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  text: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
