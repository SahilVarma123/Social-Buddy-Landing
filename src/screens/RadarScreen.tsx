import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';

export const RadarScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.radarGraphic}>
          <View style={styles.radarRingOuter}>
            <View style={styles.radarRingMiddle}>
              <View style={styles.radarRingInner}>
                <Ionicons name="radio" size={32} color={colors.amberPrimary} />
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Hyperlocal Radar</Text>
        <Text style={styles.subtitle}>
          Interactive live radar map discovering real-time activity and crowds near your campus/neighborhood.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  radarGraphic: {
    marginBottom: spacing.xl,
  },
  radarRingOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.03)',
  },
  radarRingMiddle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
  },
  radarRingInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.amberPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
