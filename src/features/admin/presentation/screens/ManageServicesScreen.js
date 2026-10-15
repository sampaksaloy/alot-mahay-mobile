import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Modal, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useServices } from '../../../services/presentation/hooks/useServices';
import { manageServiceUseCase } from '../../../services/domain/usecases/manageServiceUseCase';
import { theme } from '../../../../core/theme/theme';
import Button from '../../../../components/Button';
import InputField from '../../../../components/InputField';
import SearchInput from '../../../../components/SearchInput';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import EmptyState from '../../../../components/EmptyState';

const emptyForm = { name: '', category: '', description: '', price: '', estimated_duration: '' };

export default function ManageServicesScreen() {
  const { services, loading, refresh } = useServices();
  const [search, setSearch] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = search.trim()
    ? services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : services;

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setErrors({});
    setFormVisible(true);
  };

  const openEdit = (svc) => {
    setForm({
      name: svc.name,
      category: svc.category || '',
      description: svc.description || '',
      price: String(svc.price),
      estimated_duration: String(svc.estimatedDuration || svc.estimated_duration || ''),
    });
    setEditingId(svc.id);
    setErrors({});
    setFormVisible(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Valid price is required';
    if (!form.estimated_duration || isNaN(Number(form.estimated_duration)) || Number(form.estimated_duration) <= 0) {
      e.estimated_duration = 'Valid duration (minutes) is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        estimated_duration: Number(form.estimated_duration),
      };
      if (editingId) {
        await manageServiceUseCase.update(editingId, payload);
      } else {
        await manageServiceUseCase.create(payload);
      }
      setFormVisible(false);
      refresh();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await manageServiceUseCase.remove(deleteTarget.id);
      setDeleteTarget(null);
      refresh();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const update = (key) => (value) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <SearchInput value={search} onChangeText={setSearch} placeholder="Search services..." style={styles.search} />
        <Button label="+ Add" onPress={openCreate} style={styles.addBtn} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.category}>{item.category}</Text>
              </View>
              <Text style={styles.price}>₱{item.price}</Text>
            </View>
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            <View style={styles.durationRow}>
              <Ionicons name="time-outline" size={13} color={theme.colors.textMuted} style={{ marginRight: 4 }} />
              <Text style={styles.duration}>{item.estimatedDuration || item.estimated_duration} min</Text>
            </View>
            <View style={styles.actions}>
              <Button label="Edit" icon="pencil-outline" size="small" variant="outline" onPress={() => openEdit(item)} style={styles.actionBtn} />
              <Button label="Delete" icon="trash-outline" size="small" variant="danger" onPress={() => setDeleteTarget(item)} style={styles.actionBtn} />
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="cut-outline" title="No services" message="Add your first service" />}
        contentContainerStyle={filtered.length === 0 ? styles.emptyList : styles.listContent}
      />

      {/* Create/Edit Modal */}
      <Modal visible={formVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalTitle}>{editingId ? 'Edit Service' : 'New Service'}</Text>
            <InputField label="Service Name *" value={form.name} onChangeText={update('name')} error={errors.name} />
            <InputField label="Category" value={form.category} onChangeText={update('category')} placeholder="e.g. Haircut, Color, Grooming" />
            <InputField label="Description" value={form.description} onChangeText={update('description')} multiline />
            <InputField label="Price (₱) *" value={form.price} onChangeText={update('price')} keyboardType="numeric" error={errors.price} />
            <InputField label="Est. Duration (min) *" value={form.estimated_duration} onChangeText={update('estimated_duration')} keyboardType="numeric" error={errors.estimated_duration} />
            <View style={styles.modalActions}>
              <Button label="Cancel" variant="outline" onPress={() => setFormVisible(false)} style={styles.modalBtn} />
              <Button label={saving ? 'Saving...' : 'Save'} onPress={handleSave} loading={saving} style={styles.modalBtn} />
            </View>
          </ScrollView>
        </View>
      </Modal>

      <ConfirmationModal
        visible={!!deleteTarget}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.sm },
  cardInfo: { flex: 1 },
  name: { ...theme.typography.body, fontWeight: '700', color: theme.colors.textPrimary },
  category: { ...theme.typography.caption, color: theme.colors.primaryLight, fontWeight: '600' },
  price: { ...theme.typography.h3, color: theme.colors.secondaryDark },
  description: { ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs },
  duration: { ...theme.typography.caption, color: theme.colors.textMuted },
  actions: { flexDirection: 'row', marginTop: theme.spacing.md },
  actionBtn: { marginRight: theme.spacing.sm, minWidth: 80 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: theme.spacing.xl, maxHeight: '85%' },
  modalTitle: { ...theme.typography.h2, color: theme.colors.primary, marginBottom: theme.spacing.lg },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: theme.spacing.md },
  modalBtn: { marginLeft: theme.spacing.sm, minWidth: 100 },
});
