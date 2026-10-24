import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../context/EventsContext';
import { useLocation } from '../context/LocationContext';
import { calculateDistanceKm, formatDistance } from '../utils/distance';
import { RootStackParamList } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const RadarScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { allEvents, isSaved, toggleSave } = useEvents();
  const { userCoordinates, locationName } = useLocation();
  const [radarRangeKm, setRadarRangeKm] = useState<number>(10);

  const radarEvents = allEvents
    .map((e) => ({
      ...e,
      distanceKm: calculateDistanceKm(userCoordinates, e.coordinates),
    }))
    .filter((e) => e.distanceKm <= radarRangeKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Proximity Radar</Text>
          <Text style={styles.headerSubtitle}>Scanning near {locationName}</Text>
        </View>
        <View style={styles.livePulseBadge}>
          <View style={styles.pulseDot} />
          <Text style={styles.livePulseText}>LIVE</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Radar Graphic Visual */}
        <View style={styles.radarVisualContainer}>
          <View style={styles.radarRingOuter}>
            <View style={styles.radarRingMiddle}>
              <View style={styles.radarRingInner}>
                <Ionicons name="radio" size={30} color={colors.amberPrimary} />
              </View>
            </View>
          </View>
          <View style={styles.radarInfoBadge}>
            <Text style={styles.radarInfoText}>
              {radarEvents.length} events active within {radarRangeKm} km
            </Text>
          </View>
        </View>

        {/* Range Selector */}
        <View style={styles.rangeSelectorRow}>
          {[5, 10, 20, 35].map((km) => (
            <TouchableOpacity
              key={km}
              style={[styles.rangePill, radarRangeKm === km && styles.rangePillActive]}
              onPress={() => setRadarRangeKm(km)}
            >
              <Text style={[styles.rangePillText, radarRangeKm === km && styles.rangePillTextActive]}>
                {km} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby Events List in order of distance */}
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Closest to You</Text>
          {radarEvents.length === 0 ? (
            <View style={styles.emptyRadar}>
              <Ionicons name="radio-outline" size={28} color={colors.textMuted} style={styles.emptyRadarIcon} />
              <Text style={styles.emptyRadarTitle}>No events in {radarRangeKm} km radius</Text>
              <Text style={styles.emptyRadarSub}>
                Tap 20 km or 35 km above to expand your proximity scan.
              </Text>
            </View>
          ) : (
            radarEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventRow}
                onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
                activeOpacity={0.8}
              >
                <View style={styles.distanceBadge}>
                  <Ionicons name="location" size={14} color={colors.amberPrimary} />
                  <Text style={styles.distanceText}>{formatDistance(event.distanceKm)}</Text>
                </View>

                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={styles.eventSub} numberOfLines={1}>
                    {event.venue} • {event.category}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.bookmarkBtn}
                  onPress={() => toggleSave(event.id)}
                >
                  <Ionicons
                    name={isSaved(event.id) ? 'bookmark' : 'bookmark-outline'}
                    size={16}
                    color={isSaved(event.id) ? colors.amberPrimary : colors.textMuted}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  livePulseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.danger,
  },
  livePulseText: {
    ...typography.micro,
    color: colors.danger,
    fontSize: 10,
    fontWeight: '700',
  },
  container: {
    paddingBottom: spacing.xxxl,
  },
  radarVisualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  radarRingOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.03)',
  },
  radarRingMiddle: {
    width: 115,
    height: 115,
    borderRadius: 57.5,
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
  },
  radarRingInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.amberPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarInfoBadge: {
    marginTop: spacing.md,
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  radarInfoText: {
    ...typography.caption,
    color: colors.amberPrimary,
    fontWeight: '600',
  },
  rangeSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  rangePill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  rangePillActive: {
    backgroundColor: colors.amberPrimary,
    borderColor: colors.amberLight,
  },
  rangePillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  rangePillTextActive: {
    color: colors.textOnAmber,
    fontWeight: '700',
  },
  listSection: {
    paddingHorizontal: spacing.lg,
  },
  listTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  distanceBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    marginRight: spacing.sm,
  },
  distanceText: {
    ...typography.caption,
    color: colors.amberPrimary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  eventSub: {
    ...typography.caption,
    color: colors.textMuted,
  },
  bookmarkBtn: {
    padding: spacing.xs,
  },
  emptyRadar: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginVertical: spacing.sm,
  },
  emptyRadarIcon: {
    marginBottom: spacing.xs,
  },
  emptyRadarTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyRadarSub: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
