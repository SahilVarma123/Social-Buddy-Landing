import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';

const PRESETS = [3, 10, 25, 50];

interface RadiusFilterProps {
  currentRadius: number;
  onRadiusChange: (radius: number) => void;
  matchCount?: number;
}

export const RadiusFilter: React.FC<RadiusFilterProps> = ({
  currentRadius,
  onRadiusChange,
  matchCount = 0,
}) => {
  const handlePreset = (radius: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }
    onRadiusChange(radius);
  };

  const handleSliderSlidingComplete = (val: number) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Haptics fallback
    }
    onRadiusChange(Math.round(val));
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.radarIconBox}>
            <Ionicons name="radio-outline" size={14} color={colors.amberPrimary} />
          </View>
          <Text style={styles.title}>Hyperlocal Discovery Radius</Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {matchCount} event{matchCount === 1 ? '' : 's'} in range
          </Text>
        </View>
      </View>

      {/* Metric Display */}
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>Search Radius</Text>
        <Text style={styles.metricValue}>{currentRadius} km</Text>
      </View>

      {/* Continuous Slider (1 - 50 km) */}
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={50}
        step={1}
        value={currentRadius}
        onValueChange={(val) => onRadiusChange(Math.round(val))}
        onSlidingComplete={handleSliderSlidingComplete}
        minimumTrackTintColor={colors.amberPrimary}
        maximumTrackTintColor={colors.surfaceElevated}
        thumbTintColor={colors.amberPrimary}
      />

      <View style={styles.sliderLimits}>
        <Text style={styles.limitText}>1 km (Walking)</Text>
        <Text style={styles.limitText}>50 km (Metro Area)</Text>
      </View>

      {/* Quick Jump Presets */}
      <View style={styles.presetsRow}>
        {PRESETS.map((p) => {
          const isActive = currentRadius === p;
          return (
            <TouchableOpacity
              key={p}
              style={[styles.presetChip, isActive && styles.presetChipActive]}
              onPress={() => handlePreset(p)}
              activeOpacity={0.7}
            >
              <Text style={[styles.presetText, isActive && styles.presetTextActive]}>
                {p} km
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
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  radarIconBox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  countText: {
    ...typography.caption,
    color: colors.amberPrimary,
    fontWeight: '700',
    fontSize: 11,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: spacing.xs,
    marginBottom: 2,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  metricValue: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 36,
  },
  sliderLimits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
    marginBottom: spacing.sm,
  },
  limitText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: spacing.sm,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 4,
    alignItems: 'center',
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  presetChipActive: {
    backgroundColor: colors.amberPrimary,
    borderColor: colors.amberLight,
  },
  presetText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  presetTextActive: {
    color: colors.textOnAmber,
    fontWeight: '700',
  },
});
