import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMyProfileUseCase } from '../../domain/usecases/getMyProfileUseCase';
import { logoutUseCase } from '../../../auth/domain/usecases/logoutUseCase';
import { theme } from '../../../../core/theme/theme';
import Button from '../../../../components/Button';
import InputField from '../../../../components/InputField';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import AvatarPickerModal from '../../../../components/AvatarPickerModal';
import { mockDataStore } from '../../../../core/data/mockDataStore';
import { setStoredUser } from '../../../../core/storage/localStorage';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const u = await getMyProfileUseCase();
      setUser(u);
      if (u) setForm({ name: u.name, phone: u.phone });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const handleSave = async () => {
    if (!form.name.trim()) { Alert.alert('Error', 'Name is required'); return; }
    setSaving(true);
    try {
      const updated = mockDataStore.updateUser(user.id, { name: form.name, phone: form.phone });
      const { password, ...safe } = updated;
      setUser(safe);
      await setStoredUser(safe);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAvatar = async (avatarUri) => {
    if (!user) return;
    try {
      const updated = mockDataStore.updateUser(user.id, { avatar: avatarUri });
      if (user.role === 'STAFF') {
        const staffObj = mockDataStore.getStaffByUserId(user.id);
        if (staffObj) {
          mockDataStore.updateStaff(staffObj.id, { avatar: avatarUri });
        }
      }
      const { password, ...safe } = updated;
      setUser(safe);
      await setStoredUser(safe);
      Alert.alert('Success', 'Profile photo updated!');
    } catch (e) {
      Alert.alert('Error', 'Could not update profile photo');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logoutUseCase();
          navigation.reset({ index: 0, routes: [{ name: 'AuthStack' }] });
        },
      },
    ]);
  };

  if (loading) return <LoadingIndicator />;
  if (!user) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>Could not load profile.</Text>
      <Button label="Retry" variant="outline" onPress={loadProfile} />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar Container */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={() => setShowAvatarPicker(true)}
          activeOpacity={0.8}
          accessibilityLabel="Change profile picture"
        >
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.changePhotoBtn}
          onPress={() => setShowAvatarPicker(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="image-outline" size={14} color={theme.colors.royalBlue} style={{ marginRight: 4 }} />
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </TouchableOpacity>

        <Text style={styles.userName}>{user.name}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.userRole}>{user.role}</Text>
        </View>
      </View>

      {/* Info card */}
      <View style={styles.card}>
        {editing ? (
          <>
            <InputField
              label="Full Name"
              value={form.name}
              onChangeText={(v) => setForm(p => ({...p, name: v}))}
            />
            <InputField
              label="Phone"
              value={form.phone}
              onChangeText={(v) => setForm(p => ({...p, phone: v}))}
              keyboardType="phone-pad"
            />
            <View style={styles.editButtons}>
              <Button label="Cancel" variant="outline" onPress={() => setEditing(false)} style={styles.editBtn} />
              <Button label="Save Changes" onPress={handleSave} loading={saving} style={styles.editBtn} />
            </View>
          </>
        ) : (
          <>
            <InfoRow label="Email Address" value={user.email} />
            <InfoRow label="Contact Phone" value={user.phone} />
            <InfoRow label="Account Status" value={user.status} />
            <Button
              label="Edit Profile Details"
              icon="pencil-outline"
              variant="outline"
              onPress={() => setEditing(true)}
              style={styles.editProfileBtn}
            />
          </>
        )}
      </View>

      <Button
        label="Sign Out"
        icon="log-out-outline"
        variant="danger"
        onPress={handleLogout}
        style={styles.logoutBtn}
      />

      {/* Realistic Avatar Picker Modal */}
      <AvatarPickerModal
        visible={showAvatarPicker}
        currentAvatar={user.avatar}
        role={user.role}
        onSelectAvatar={handleUpdateAvatar}
        onClose={() => setShowAvatarPicker(false)}
      />
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value || '—'}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  label: { ...theme.typography.body, color: theme.colors.textSecondary },
  value: { ...theme.typography.body, color: theme.colors.navy, fontWeight: '700' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xl * 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.lg },
  errorText: { ...theme.typography.body, color: theme.colors.textSecondary, marginBottom: theme.spacing.md },
  avatarContainer: { alignItems: 'center', marginBottom: theme.spacing.lg },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.royalBlue,
    ...theme.shadows.sm,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: theme.colors.royalBlue,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: theme.colors.royalBlue,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...theme.shadows.sm,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#EBF2FD',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D4E2F9',
  },
  changePhotoText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.royalBlue,
  },
  userName: { ...theme.typography.h2, color: theme.colors.navy },
  roleBadge: {
    backgroundColor: '#EBF2FD',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
  },
  userRole: { fontSize: 11, color: theme.colors.royalBlue, fontWeight: '700' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  editProfileBtn: { marginTop: theme.spacing.md },
  editButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: theme.spacing.md },
  editBtn: { marginLeft: theme.spacing.sm, minWidth: 100 },
  logoutBtn: { marginTop: theme.spacing.sm },
});
