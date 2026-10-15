import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { REALISTIC_AVATARS } from '../core/constants/avatars';
import { theme } from '../core/theme/theme';

export default function AvatarPickerModal({
  visible,
  currentAvatar,
  role = 'CUSTOMER',
  onSelectAvatar,
  onClose,
}) {
  const [customUrl, setCustomUrl] = useState('');
  const [selectedUri, setSelectedUri] = useState(currentAvatar || '');

  const filteredAvatars = REALISTIC_AVATARS;

  const handleApply = () => {
    if (customUrl.trim()) {
      onSelectAvatar(customUrl.trim());
    } else if (selectedUri) {
      onSelectAvatar(selectedUri);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="camera" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Choose Profile Picture</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={theme.colors.navy} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Select a realistic profile picture or input a photo URL for your account.
          </Text>

          {/* Photo Selection Grid */}
          <ScrollView
            style={styles.gridScroll}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredAvatars.map((item) => {
              const isSelected = selectedUri === item.uri && !customUrl;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.avatarItem,
                    isSelected && styles.avatarItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedUri(item.uri);
                    setCustomUrl('');
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.uri }} style={styles.avatarImg} />
                  {isSelected && (
                    <View style={styles.selectedCheck}>
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                  )}
                  <Text style={styles.avatarLabel} numberOfLines={1}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Custom URL Input */}
          <View style={styles.customUrlBox}>
            <Text style={styles.customUrlTitle}>Or Paste Image URL</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/photo.jpg"
                placeholderTextColor={theme.colors.textMuted}
                value={customUrl}
                onChangeText={(text) => {
                  setCustomUrl(text);
                  if (text) setSelectedUri('');
                }}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Optional Remove Photo Button */}
          {currentAvatar ? (
            <TouchableOpacity
              style={styles.removePhotoBtn}
              onPress={() => {
                onSelectAvatar(null);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={15} color="#DC2626" style={{ marginRight: 6 }} />
              <Text style={styles.removePhotoText}>Remove Photo (Use Default Initials)</Text>
            </TouchableOpacity>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleApply}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.saveText}>Save Picture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 45, 91, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    width: '100%',
    maxHeight: '85%',
    borderWidth: 1.5,
    borderColor: theme.colors.royalBlue,
    ...theme.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.royalBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.navy,
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  gridScroll: {
    maxHeight: 230,
    marginBottom: theme.spacing.md,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  avatarItem: {
    width: '30%',
    alignItems: 'center',
    padding: 6,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  avatarItemSelected: {
    borderColor: theme.colors.royalBlue,
    backgroundColor: '#EBF2FD',
  },
  avatarImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  selectedCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.royalBlue,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.navy,
    marginTop: 4,
    textAlign: 'center',
  },
  customUrlBox: {
    marginBottom: theme.spacing.md,
  },
  customUrlTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.navy,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: theme.radius.md,
    paddingVertical: 8,
    marginBottom: theme.spacing.md,
  },
  removePhotoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: theme.spacing.xs,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.royalBlue,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: theme.radius.md,
  },
  saveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
