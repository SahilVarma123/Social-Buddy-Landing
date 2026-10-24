import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { HyperlocalEvent } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';
import { formatDistance } from '../utils/distance';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.82;

interface FeaturedEventCardProps {
  event: HyperlocalEvent;
  isSaved?: boolean;
  onPress?: () => void;
  onBookmarkPress?: () => void;
}

export const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({
  event,
  isSaved = false,
  onPress,
  onBookmarkPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={styles.cardContainer}
    >
      <Image
        source={{ uri: event.imageUrl }}
        style={styles.coverImage}
        resizeMode="cover"
      />

      <LinearGradient
        colors={['transparent', 'rgba(11, 13, 17, 0.4)', 'rgba(9, 11, 14, 0.96)']}
        locations={[0, 0.35, 0.88]}
        style={styles.gradientOverlay}
      />

      {/* Top Bar inside Card */}
      <View style={styles.topBar}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>

        <View style={styles.topRightActions}>
          {event.isVerifiedRealWorld ? (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={12} color={colors.success} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          ) : (
            <View style={styles.demoBadge}>
              <Text style={styles.demoText}>Demo Spotlight</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.bookmarkButton, isSaved && styles.bookmarkButtonActive]}
            activeOpacity={0.7}
            onPress={onBookmarkPress}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={16}
              color={isSaved ? colors.amberPrimary : colors.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Content Footer */}
      <View style={styles.contentFooter}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>
            {event.displayDate} • {event.time}
          </Text>
        </View>

        <Text style={styles.titleText} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.venueRow}>
            <Ionicons name="location-sharp" size={14} color={colors.amberPrimary} />
            <Text style={styles.venueText} numberOfLines={1}>
              {event.venue}
              {event.distanceKm !== undefined ? ` • ${formatDistance(event.distanceKm)}` : ''}
            </Text>
          </View>

          <View style={styles.pricePill}>
            <Text style={styles.priceText}>{event.price}</Text>
          </View>
        </View>

        {event.buddiesAttending.length > 0 && (
          <View style={styles.buddiesRow}>
            <View style={styles.avatarGroup}>
              {event.buddiesAttending.map((buddy, index) => (
                <Image
                  key={buddy.id}
                  source={{ uri: buddy.avatarUrl }}
                  style={[styles.avatar, { marginLeft: index > 0 ? -8 : 0 }]}
                />
              ))}
            </View>
            <Text style={styles.buddiesText}>
              {event.buddiesAttending.length} buddy{event.buddiesAttending.length > 1 ? 's' : ''} going
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: 340,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    position: 'relative',
    marginRight: spacing.md,
  },
  coverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  categoryPill: {
    backgroundColor: 'rgba(9, 11, 14, 0.75)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  categoryText: {
    ...typography.micro,
    color: colors.amberPrimary,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
    gap: 3,
  },
  verifiedText: {
    ...typography.micro,
    color: colors.success,
    fontSize: 9,
  },
  demoBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: colors.borderGold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
  },
  demoText: {
    ...typography.micro,
    color: colors.amberLight,
    fontSize: 9,
  },
  bookmarkButton: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(9, 11, 14, 0.8)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButtonActive: {
    borderColor: colors.amberPrimary,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  contentFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    zIndex: 10,
  },
  dateBadge: {
    marginBottom: spacing.xs,
  },
  dateText: {
    ...typography.caption,
    color: colors.amberLight,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  titleText: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  venueText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  pricePill: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  priceText: {
    ...typography.caption,
    color: colors.amberPrimary,
    fontWeight: '700',
  },
  buddiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.surfacePrimary,
  },
  buddiesText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
});
