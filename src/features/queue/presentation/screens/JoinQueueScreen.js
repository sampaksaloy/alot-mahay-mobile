import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme/theme';

// TODO: pilion ang service/staff (gikan sa features/services), tapos i-tawag
// ang useQueue().joinQueue(serviceId, staffId), unya navigate sa QueueTrackingScreen.
export default function JoinQueueScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Join Queue</Text>
      <Text style={styles.hint}>
        Service + staff selection UI diri. Tan-awa ang features/services para sa listahan.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  hint: { marginTop: theme.spacing.md, color: theme.colors.textSecondary },
});
