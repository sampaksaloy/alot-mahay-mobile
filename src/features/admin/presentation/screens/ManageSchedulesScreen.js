import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Modal, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme/theme';
import { mockDataStore } from '../../../../core/data/mockDataStore';
import Button from '../../../../components/Button';
import InputField from '../../../../components/InputField';
import EmptyState from '../../../../components/EmptyState';
import ConfirmationModal from '../../../../components/ConfirmationModal';

export default function ManageSchedulesScreen() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ staff_id: '', staff_name: '', date: '', start_time: '', end_time: '' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    setSchedules(mockDataStore.getSchedules());
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const staffList = mockDataStore.getStaff();

  const openCreate = () => {
    const today = new Date().toISOString().slice(0, 10);
    setForm({ staff_id: staffList[0]?.id || '', staff_name: staffList[0]?.name || '', date: today, start_time: '08:00', end_time: '17:00' });
    setEditingId(null);
    setFormVisible(true);
  };

  const openEdit = (sch) => {
    setForm({
      staff_id: sch.staff_id,
      staff_name: sch.staff_name,
      date: sch.date,
      start_time: sch.start_time,
      end_time: sch.end_time,
    });
    setEditingId(sch.id);
    setFormVisible(true);
  };

  const handleSave = () => {
    if (!form.date) { Alert.alert('Error', 'Date is required'); return; }
    if (!form.start_time || !form.end_time) { Alert.alert('Error', 'Start and end times are required'); return; }
    if (form.start_time >= form.end_time) { Alert.alert('Error', 'End time must be after start time'); return; }
    setSaving(true);
    try {
      if (editingId) {
        mockDataStore.updateSchedule(editingId, { ...form, available: true });
      } else {
        mockDataStore.addSchedule({ ...form, available: true });
      }
      setFormVisible(false);
      loadData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    mockDataStore.removeSchedule(deleteTarget.id);
    setDeleteTarget(null);
    loadData();
  };

  const update = (key) => (value) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Staff Schedules</Text>
        <Button label="+ Add" onPress={openCreate} style={styles.addBtn} />
      </View>

      <FlatList
        data={schedules}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.staffName}>{item.staff_name}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm }}>
              <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} style={{ marginRight: 5 }} />
              <Text style={styles.timeRange}>{item.start_time} — {item.end_time}</Text>
            </View>
            <View style={styles.actions}>
              <Button label="Edit" icon="pencil-outline" size="small" variant="outline" onPress={() => openEdit(item)} style={styles.actionBtn} />
              <Button label="Delete" icon="trash-outline" size="small" variant="danger" onPress={() => setDeleteTarget(item)} style={styles.actionBtn} />
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="calendar-outline" title="No schedules" message="Add staff work schedules" />}
        contentContainerStyle={schedules.length === 0 ? styles.emptyList : styles.listContent}
      />

      <Modal visible={formVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitle}>{editingId ? 'Edit Schedule' : 'New Schedule'}</Text>

            <Text style={styles.fieldLabel}>Staff Member</Text>
            <View style={styles.staffPicker}>
              {staffList.map((s) => (
                <Button
                  key={s.id}
                  label={s.name}
                  variant={form.staff_id === s.id ? 'primary' : 'outline'}
                  onPress={() => setForm((p) => ({ ...p, staff_id: s.id, staff_name: s.name }))}
                  style={styles.staffPickerBtn}
                />
              ))}
            </View>

            <InputField label="Date (YYYY-MM-DD)" value={form.date} onChangeText={update('date')} placeholder="2026-10-15" />
            <InputField label="Start Time (HH:MM)" value={form.start_time} onChangeText={update('start_time')} placeholder="08:00" />
            <InputField label="End Time (HH:MM)" value={form.end_time} onChangeText={update('end_time')} placeholder="17:00" />

            <View style={styles.modalActions}>
              <Button label="Cancel" variant="outline" onPress={() => setFormVisible(false)} style={styles.modalBtn} />
              <Button label="Save" onPress={handleSave} loading={saving} style={styles.modalBtn} />
            </View>
          </ScrollView>
        </View>
      </Modal>

      <ConfirmationModal
        visible={!!deleteTarget}
        title="Delete Schedule"
        message={`Delete schedule for ${deleteTarget?.staff_name}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md, marginBottom: theme.spacing.sm },
  title: { ...theme.typography.h3, color: theme.colors.textPrimary },
  addBtn: { minWidth: 70 },
  listContent: { padding: theme.spacing.lg },
  emptyList: { flexGrow: 1, padding: theme.spacing.lg },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  staffName: { ...theme.typography.body, fontWeight: '700', color: theme.colors.textPrimary },
  date: { ...theme.typography.caption, color: theme.colors.primaryLight, fontWeight: '600' },
  timeRange: { ...theme.typography.body, color: theme.colors.textSecondary },
  actions: { flexDirection: 'row', marginTop: theme.spacing.md },
  actionBtn: { marginRight: theme.spacing.sm, minWidth: 80 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: theme.spacing.xl, maxHeight: '85%' },
  modalTitle: { ...theme.typography.h2, color: theme.colors.primary, marginBottom: theme.spacing.lg },
  fieldLabel: { ...theme.typography.caption, color: theme.colors.textSecondary, fontWeight: '600', marginBottom: theme.spacing.sm },
  staffPicker: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: theme.spacing.md },
  staffPickerBtn: { marginRight: theme.spacing.sm, marginBottom: theme.spacing.sm },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: theme.spacing.md },
  modalBtn: { marginLeft: theme.spacing.sm, minWidth: 100 },
});
