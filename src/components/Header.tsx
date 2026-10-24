import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';

interface HeaderProps {
  locationName?: string;
  radiusKm?: number;
  onLocationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  locationName = 'Downtown Arts District',
  radiusKm = 10,
  onLocationPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.locationSelector}
        activeOpacity={0.8}
        onPress={onLocationPress}
      >
        <View style={styles.markerContainer}>
          <Ionicons name="location-sharp" size={16} color={colors.amberPrimary} />
        </View>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.locationText} numberOfLines={1}>
              {locationName}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
          </View>
          <Text style={styles.radiusSubtext}>
            Scanning within <Text style={styles.radiusHighlight}>{radiusKm} km</Text>
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
          <View style={styles.activeDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  radiusSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  radiusHighlight: {
    color: colors.amberPrimary,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.amberPrimary,
  },
});
