import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Modal, ScrollView, RefreshControl } from 'react-native';
import { manageStaffUseCase } from '../../../staff/domain/usecases/manageStaffUseCase';
import { theme } from '../../../../core/theme/theme';
import Button from '../../../../components/Button';
import InputField from '../../../../components/InputField';
import SearchInput from '../../../../components/SearchInput';
import EmptyState from '../../../../components/EmptyState';

const emptyForm = { name: '', staffType: '', specialization: '', status: 'AVAILABLE' };

export default function ManageStaffScreen() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const list = await manageStaffUseCase.list();
      setStaffList(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = search.trim()
    ? staffList.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : staffList;

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setFormVisible(true);
  };

  const openEdit = (stf) => {
    setForm({
      name: stf.name,
      staffType: stf.staffType || '',
      specialization: stf.specialization || '',
      status: stf.status || 'AVAILABLE',
    });
    setEditingId(stf.id);
    setFormVisible(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { Alert.alert('Error', 'Name is required'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        staffType: form.staffType.trim(),
        specialization: form.specialization.trim(),
        status: form.status,
      };
      if (editingId) {
        await manageStaffUseCase.update(editingId, payload);
      } else {
        await manageStaffUseCase.create(payload);
      }
      setFormVisible(false);
      loadData();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (stf) => {
    const newStatus = stf.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';
    try {
      await manageStaffUseCase.update(stf.id, { status: newStatus });
      loadData();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const update = (key) => (value) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <SearchInput value={search} onChangeText={setSearch} placeholder="Search staff..." style={styles.search} />
        <Button label="+ Add" onPress={openCreate} style={styles.addBtn} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name?.charAt(0)?.toUpperCase()}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.type}>{item.staffType}</Text>
                <Text style={styles.spec}>{item.specialization}</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: item.status === 'AVAILABLE' ? theme.colors.success : theme.colors.textMuted }]} />
            </View>
            <View style={styles.actions}>
              <Button label="Edit" variant="outline" onPress={() => openEdit(item)} style={styles.actionBtn} />
              <Button
                label={item.status === 'AVAILABLE' ? 'Set Unavailable' : 'Set Available'}
                variant={item.status === 'AVAILABLE' ? 'outline' : 'primary'}
                onPress={() => toggleStatus(item)}
                style={styles.actionBtn}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="people-outline" title="No staff" message="Add your first staff member" />}
        contentContainerStyle={filtered.length === 0 ? styles.emptyList : styles.listContent}
      />

      <Modal visible={formVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitle}>{editingId ? 'Edit Staff' : 'Add Staff'}</Text>
            <InputField label="Full Name *" value={form.name} onChangeText={update('name')} />
            <InputField label="Staff Type" value={form.staffType} onChangeText={update('staffType')} placeholder="e.g. Barber, Stylist" />
            <InputField label="Specialization" value={form.specialization} onChangeText={update('specialization')} placeholder="e.g. Haircut, Coloring" />
            <View style={styles.modalActions}>
              <Button label="Cancel" variant="outline" onPress={() => setFormVisible(false)} style={styles.modalBtn} />
              <Button label={saving ? 'Saving...' : 'Save'} onPress={handleSave} loading={saving} style={styles.modalBtn} />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  topBar: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md },
  search: { flex: 1, marginRight: theme.spacing.sm },
  addBtn: { marginTop: 0, minWidth: 70 },
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
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: { color: theme.colors.white, fontWeight: '700', fontSize: 18 },
  cardInfo: { flex: 1 },
  name: { ...theme.typography.body, fontWeight: '700', color: theme.colors.textPrimary },
  type: { ...theme.typography.caption, color: theme.colors.primaryLight, fontWeight: '600' },
  spec: { ...theme.typography.caption, color: theme.colors.textSecondary },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  actions: { flexDirection: 'row', marginTop: theme.spacing.md },
  actionBtn: { marginRight: theme.spacing.sm, minWidth: 90 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: theme.spacing.xl, maxHeight: '80%' },
  modalTitle: { ...theme.typography.h2, color: theme.colors.primary, marginBottom: theme.spacing.lg },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: theme.spacing.md },
  modalBtn: { marginLeft: theme.spacing.sm, minWidth: 100 },
});
