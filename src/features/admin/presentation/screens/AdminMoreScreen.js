import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../../core/theme/theme';
import { getStoredUser, setStoredUser } from '../../../../core/storage/localStorage';
import { mockDataStore } from '../../../../core/data/mockDataStore';
import { logoutUseCase } from '../../../auth/domain/usecases/logoutUseCase';
import AvatarPickerModal from '../../../../components/AvatarPickerModal';

export default function AdminMoreScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const u = await getStoredUser();
      setUser(u);
      if (u) {
        setForm({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
        });
      }
    })();
  }, []);

  const handleSaveProfile = async () => {
    if (!form.name.trim()) {
      Alert.alert('Validation Error', 'Admin name is required');
      return;
    }
    setSaving(true);
    try {
      const updated = mockDataStore.updateUser(user.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      const { password, ...safe } = updated;
      setUser(safe);
      await setStoredUser(safe);
      setShowEditModal(false);
      Alert.alert('Success', 'Admin profile details updated successfully!');
    } catch (e) {
      Alert.alert('Error', 'Failed to update admin profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAvatar = async (avatarUri) => {
    if (!user) return;
    try {
      const updated = mockDataStore.updateUser(user.id, { avatar: avatarUri });
      const { password, ...safe } = updated;
      setUser(safe);
      await setStoredUser(safe);
      Alert.alert('Success', 'Admin profile photo updated!');
    } catch (e) {
      Alert.alert('Error', 'Failed to update admin avatar');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to log out of the admin panel?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logoutUseCase();
            navigation.reset({ index: 0, routes: [{ name: 'AuthStack' }] });
          },
        },
      ]
    );
  };

  const sections = [
    {
      title: 'Management & Operations',
      items: [
        {
          id: 'customers',
          label: 'Customer Accounts',
          desc: 'View customer directory and queue history',
          icon: 'people-outline',
          route: 'ManageCustomers',
          color: theme.colors.royalBlue,
        },
        {
          id: 'schedules',
          label: 'Staff Rosters & Schedules',
          desc: 'Assign shift hours and working days',
          icon: 'calendar-outline',
          route: 'ManageSchedules',
          color: theme.colors.navy,
        },
        {
          id: 'ratings',
          label: 'Ratings & Client Feedback',
          desc: 'Monitor reviews, stars, and comments',
          icon: 'star-outline',
          route: 'Ratings',
          color: theme.colors.royalBlue,
        },
        {
          id: 'reports',
          label: 'Reports & Business Analytics',
          desc: 'Throughput, wait-times, and service demand',
          icon: 'bar-chart-outline',
          route: 'Reports',
          color: theme.colors.navy,
        },
      ],
    },
    {
      title: 'Shop Configuration',
      items: [
        {
          id: 'shop_info',
          label: 'Salon Information',
          desc: 'Alot Mahay Barbershop & Salon (Operating Hours)',
          icon: 'business-outline',
          color: theme.colors.navy,
          onPress: () => {
            Alert.alert(
              'Alot Mahay Salon & Barbershop',
              'Operating Hours: Mon - Sun, 8:00 AM - 7:00 PM\nCapacity: 3 active barber chairs\nPredictive Queue: Linear Regression / Exponential Smoothing model active.'
            );
          },
        },
        {
          id: 'queue_settings',
          label: 'Queue System Parameters',
          desc: 'Auto-advance window, max wait buffer',
          icon: 'options-outline',
          color: theme.colors.royalBlue,
          onPress: () => {
            Alert.alert(
              'Queue Parameters',
              'Default service buffer: 5 mins\nGrace period for called tickets: 10 mins\nWait time algorithm: Queue length × Average duration + Active service remaining time.'
            );
          },
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Admin Profile Card */}
      <View style={styles.profileCard}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={() => setShowAvatarPicker(true)}
          activeOpacity={0.8}
        >
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'A'}</Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={13} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || 'Admin Owner'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'admin@test.com'}</Text>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={12} color={theme.colors.royalBlue} />
            <Text style={styles.badgeText}>Shop Owner / Admin</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => setShowEditModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={15} color={theme.colors.royalBlue} />
          <Text style={styles.editProfileBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Sections */}
      {sections.map((section, sIdx) => (
        <View key={sIdx} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.cardGroup}>
            {section.items.map((item, iIdx) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  iIdx < section.items.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => {
                  if (item.route) navigation.navigate(item.route);
                  else if (item.onPress) item.onPress();
                }}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon} size={20} color={theme.colors.royalBlue} />
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Text style={styles.itemDesc} numberOfLines={1}>{item.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Sign Out Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color={theme.colors.navy} style={{ marginRight: 8 }} />
        <Text style={styles.logoutButtonText}>Sign Out of Admin Portal</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Alot Mahay Mobile v1.0.0 (Capstone Edition)</Text>

      {/* Admin Profile Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Admin Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={22} color={theme.colors.navy} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalPhotoChange}
              onPress={() => {
                setShowEditModal(false);
                setTimeout(() => setShowAvatarPicker(true), 300);
              }}
            >
              <Ionicons name="camera-outline" size={16} color={theme.colors.royalBlue} style={{ marginRight: 6 }} />
              <Text style={styles.modalPhotoChangeText}>Change Profile Picture</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={form.name}
                onChangeText={(text) => setForm((p) => ({ ...p, name: text }))}
                placeholder="Admin Name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                value={form.email}
                onChangeText={(text) => setForm((p) => ({ ...p, email: text }))}
                placeholder="admin@test.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Phone</Text>
              <TextInput
                style={styles.textInput}
                value={form.phone}
                onChangeText={(text) => setForm((p) => ({ ...p, phone: text }))}
                placeholder="0917 123 4567"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                <Text style={styles.modalSaveText}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        visible={showAvatarPicker}
        currentAvatar={user?.avatar}
        role="ADMIN"
        onSelectAvatar={handleUpdateAvatar}
        onClose={() => setShowAvatarPicker(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl * 2,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.royalBlue,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: theme.colors.royalBlue,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: theme.colors.royalBlue,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EBF2FD',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#D4E2F9',
  },
  editProfileBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.royalBlue,
  },
  avatarText: {
    color: theme.colors.white,
    fontWeight: '800',
    fontSize: 22,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  profileEmail: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.royalBlue + '12',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.royalBlue,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.captionBold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: theme.spacing.sm,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF2FD',
    borderWidth: 1,
    borderColor: '#D4E2F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  itemLabel: {
    ...theme.typography.bodyBold,
    color: theme.colors.textPrimary,
  },
  itemDesc: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    marginTop: theme.spacing.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.navy,
  },
  logoutButtonText: {
    color: theme.colors.navy,
    fontWeight: '700',
    fontSize: 15,
  },
  versionText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 91, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    width: '100%',
    borderWidth: 1.5,
    borderColor: theme.colors.royalBlue,
    ...theme.shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.navy,
  },
  modalPhotoChange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF2FD',
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#D4E2F9',
    marginBottom: theme.spacing.md,
  },
  modalPhotoChangeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.royalBlue,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: theme.spacing.sm,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  modalSaveBtn: {
    backgroundColor: theme.colors.royalBlue,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: theme.radius.md,
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
