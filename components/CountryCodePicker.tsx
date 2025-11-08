/**
 * Country Code Picker Component
 * For phone number input with country selection
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';

export interface CountryCode {
  code: string; // e.g., "+1"
  country: string; // e.g., "US"
  name: string; // e.g., "United States"
  flag: string; // e.g., "🇺🇸"
}

const COUNTRY_CODES: CountryCode[] = [
  { code: '+1', country: 'US', name: 'United States', flag: '🇺🇸' },
  { code: '+1', country: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: '+44', country: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+86', country: 'CN', name: 'China', flag: '🇨🇳' },
  { code: '+91', country: 'IN', name: 'India', flag: '🇮🇳' },
  { code: '+81', country: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: '+49', country: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'FR', name: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: '+7', country: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: '+61', country: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: '+55', country: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: '+62', country: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+63', country: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: '+84', country: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+66', country: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: '+60', country: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', country: 'SG', name: 'Singapore', flag: '🇸🇬' },
];

interface CountryCodePickerProps {
  selectedCode: CountryCode;
  onSelect: (code: CountryCode) => void;
}

export default function CountryCodePicker({
  selectedCode,
  onSelect,
}: CountryCodePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCodes = COUNTRY_CODES.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.includes(searchQuery) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code: CountryCode) => {
    onSelect(code);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{selectedCode.flag}</Text>
        <Text style={styles.code}>{selectedCode.code}</Text>
        <MaterialIcons name="arrow-drop-down" size={20} color={Colors.text.tertiary} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Country</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={Colors.text.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search country or code..."
              placeholderTextColor={Colors.text.disabled}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

          {/* List */}
          <FlatList
            data={filteredCodes}
            keyExtractor={(item, index) => `${item.country}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.countryItem,
                  item.code === selectedCode.code &&
                    item.country === selectedCode.country &&
                    styles.countryItemSelected,
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.countryFlag}>{item.flag}</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryCode}>{item.code}</Text>
                </View>
                {item.code === selectedCode.code &&
                  item.country === selectedCode.country && (
                    <MaterialIcons
                      name="check"
                      size={24}
                      color={Colors.primary[500]}
                    />
                  )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    backgroundColor: Colors.neutral[50],
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Theme.spacing.xs,
  },
  flag: {
    fontSize: 24,
  },
  code: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
    color: Colors.text.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerTitle: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Theme.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    paddingVertical: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    color: Colors.text.primary,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Colors.surface,
  },
  countryItemSelected: {
    backgroundColor: Colors.primary[50],
  },
  countryFlag: {
    fontSize: 32,
    marginRight: Theme.spacing.md,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  countryCode: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Theme.spacing.lg,
  },
});
