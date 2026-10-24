import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../context/EventsContext';
import { useLocation } from '../context/LocationContext';
import { colors, spacing, borderRadius, typography } from '../theme';

export const ProfileScreen: React.FC = () => {
  const { savedIds, rsvpIds } = useEvents();
  const { locationName, permissionStatus, isUsingFallback, refreshLocation } = useLocation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
            }}
            style={styles.avatar}
          />
          <View style={styles.statusBadge}>
            <Ionicons name="sparkles" size={12} color={colors.amberPrimary} />
          </View>
        </View>

        <Text style={styles.userName}>Alex Mercer</Text>
        <Text style={styles.userBio}>
          Indie Music, Hackathons & Hyperlocal Discovery
        </Text>

        {/* Real Dynamic Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{rsvpIds.length}</Text>
            <Text style={styles.statLabel}>Attending</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{savedIds.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>Buddies</Text>
          </View>
        </View>

        {/* Location & GPS Status Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionCardHeader}>
            <Ionicons name="navigate-circle-outline" size={18} color={colors.amberPrimary} />
            <Text style={styles.sectionCardTitle}>Geospatial Discovery Status</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Active Radar Center:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {locationName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>GPS Mode:</Text>
            <View style={styles.modePill}>
              <Text style={styles.modeText}>
                {isUsingFallback ? 'Demo Fallback Simulation' : 'Live Device GPS'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.refreshLocBtn}
            onPress={refreshLocation}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={14} color={colors.amberPrimary} />
            <Text style={styles.refreshLocText}>Refresh GPS Permission</Text>
          </TouchableOpacity>
        </View>

        {/* Problem Statement 1 Context Note */}
        <View style={styles.hackathonCard}>
          <View style={styles.hackathonHeader}>
            <Ionicons name="trophy-outline" size={16} color={colors.amberPrimary} />
            <Text style={styles.hackathonTitle}>VecnaVerse Hackathon Edition</Text>
          </View>
          <Text style={styles.hackathonText}>
            Problem Statement 1: Hyperlocal Event Discovery & Community Engagement.
            All distance calculations run natively on-device using the Haversine formula.
          </Text>
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
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: colors.amberPrimary,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.surfaceElevated,
    padding: 6,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  userName: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userBio: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: colors.amberPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderSubtle,
  },
  sectionCard: {
    width: '100%',
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: spacing.md,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sectionCardTitle: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    maxWidth: '55%',
  },
  modePill: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  modeText: {
    ...typography.micro,
    color: colors.amberLight,
    fontSize: 10,
  },
  refreshLocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  refreshLocText: {
    ...typography.caption,
    color: colors.amberPrimary,
    fontWeight: '600',
  },
  hackathonCard: {
    width: '100%',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  hackathonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  hackathonTitle: {
    ...typography.caption,
    color: colors.amberLight,
    fontWeight: '700',
  },
  hackathonText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
