import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';

const RADIUS_OPTIONS = [2, 5, 10, 25, 50];

interface RadiusFilterProps {
  currentRadius: number;
  onRadiusChange: (radius: number) => void;
  matchCount?: number;
}

export const RadiusFilter: React.FC<RadiusFilterProps> = ({
  currentRadius,
  onRadiusChange,
  matchCount,
}) => {
  const handleSelect = (radius: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Graceful fallback if haptics is not available
    }
    onRadiusChange(radius);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.labelGroup}>
          <Ionicons name="radio-outline" size={16} color={colors.amberPrimary} />
          <Text style={styles.label}>Hyperlocal Radar</Text>
        </View>
        {matchCount !== undefined && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{matchCount} found nearby</Text>
          </View>
        )}
      </View>

      <View style={styles.presetRow}>
        {RADIUS_OPTIONS.map((radius) => {
          const isSelected = radius === currentRadius;
          return (
            <TouchableOpacity
              key={radius}
              style={[styles.pill, isSelected && styles.pillSelected]}
              onPress={() => handleSelect(radius)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                {radius} km
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfacePrimary,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  countText: {
    ...typography.caption,
    color: colors.amberPrimary,
    fontSize: 11,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  pill: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  pillSelected: {
    backgroundColor: colors.amberPrimary,
    borderColor: colors.amberLight,
  },
  pillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: colors.textOnAmber,
    fontWeight: '700',
  },
});
