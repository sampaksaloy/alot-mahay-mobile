import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { manageStaffUseCase } from '../../../staff/domain/usecases/manageStaffUseCase';
import { theme } from '../../../../core/theme/theme';

export default function ManageStaffScreen() {
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    manageStaffUseCase.list().then(setStaffList);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={theme.typography.h2}>Manage Staff</Text>
      <FlatList
        data={staffList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.name}</Text>
            <Text>{item.specialization}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
});
