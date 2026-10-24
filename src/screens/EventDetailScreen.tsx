import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { useEvents } from '../context/EventsContext';
import { useLocation } from '../context/LocationContext';
import { calculateDistanceKm, formatDistance } from '../utils/distance';
import { colors, spacing, borderRadius, typography } from '../theme';

const { width } = Dimensions.get('window');

type EventDetailRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const EventDetailScreen: React.FC = () => {
  const route = useRoute<EventDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { eventId } = route.params;

  const { getEventById, isSaved, toggleSave, isRsvpd, toggleRsvp, getEventAttendeeCount } =
    useEvents();
  const { userCoordinates } = useLocation();

  const event = getEventById(eventId);

  if (!event) {
    return (
      <SafeAreaView style={styles.errorSafe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const saved = isSaved(event.id);
  const rsvpd = isRsvpd(event.id);
  const attendeeCount = getEventAttendeeCount(event);
  const distance = calculateDistanceKm(userCoordinates, event.coordinates);

  const handleShare = () => {
    Alert.alert('Share Event', `Check out "${event.title}" on Social Buddy!`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-Bleed Poster Image */}
        <View style={styles.posterContainer}>
          <Image source={{ uri: event.imageUrl }} style={styles.posterImage} />
          <LinearGradient
            colors={['rgba(9, 11, 14, 0.4)', 'transparent', colors.background]}
            locations={[0, 0.4, 0.98]}
            style={styles.gradientOverlay}
          />

          {/* Floating Top Nav Bar */}
          <SafeAreaView style={styles.topNavSafe}>
            <View style={styles.topNav}>
              <TouchableOpacity
                style={styles.circleButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
              </TouchableOpacity>

              <View style={styles.topNavRight}>
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={handleShare}
                  activeOpacity={0.8}
                >
                  <Ionicons name="share-social-outline" size={18} color={colors.textPrimary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.circleButton, saved && styles.circleButtonSaved]}
                  onPress={() => toggleSave(event.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={saved ? 'bookmark' : 'bookmark-outline'}
                    size={18}
                    color={saved ? colors.amberPrimary : colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* Event Main Info */}
        <View style={styles.body}>
          {/* Badge Row */}
          <View style={styles.badgeRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{event.category}</Text>
            </View>

            {event.isVerifiedRealWorld ? (
              <View style={styles.verifiedPill}>
                <Ionicons name="shield-checkmark" size={12} color={colors.success} />
                <Text style={styles.verifiedPillText}>Verified Real-World Event</Text>
              </View>
            ) : (
              <View style={styles.demoPill}>
                <Ionicons name="flask-outline" size={12} color={colors.amberLight} />
                <Text style={styles.demoPillText}>Seeded Demonstration</Text>
              </View>
            )}

            <View style={styles.distancePill}>
              <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.distancePillText}>{formatDistance(distance)}</Text>
            </View>
          </View>

          {/* Title & Tagline */}
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.tagline}>{event.tagline}</Text>

          {/* Date & Time Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.iconSquare}>
              <Ionicons name="calendar-outline" size={20} color={colors.amberPrimary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{event.displayDate}</Text>
              <Text style={styles.infoSubtitle}>{event.time} • Local Time</Text>
            </View>
          </View>

          {/* Venue & Location Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.iconSquare}>
              <Ionicons name="map-outline" size={20} color={colors.amberPrimary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{event.venue}</Text>
              <Text style={styles.infoSubtitle}>{event.address}</Text>
            </View>
          </View>

          {/* Buddies Attending Row */}
          <View style={styles.buddiesSection}>
            <View style={styles.buddiesHeader}>
              <Ionicons name="people-outline" size={16} color={colors.amberPrimary} />
              <Text style={styles.buddiesTitle}>
                Community Presence ({attendeeCount} going)
              </Text>
            </View>

            {event.buddiesAttending.length > 0 ? (
              <View style={styles.buddiesList}>
                {event.buddiesAttending.map((buddy) => (
                  <View key={buddy.id} style={styles.buddyChip}>
                    <Image source={{ uri: buddy.avatarUrl }} style={styles.buddyAvatar} />
                    <Text style={styles.buddyName}>{buddy.name}</Text>
                  </View>
                ))}
                {rsvpd && (
                  <View style={[styles.buddyChip, styles.youChip]}>
                    <Text style={styles.youChipText}>You</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.emptyBuddiesText}>
                Be the first in your circle to RSVP!
              </Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>About the Event</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>

          {/* Host / Organizer Card */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Organized By</Text>
            <View style={styles.organizerCard}>
              <Image source={{ uri: event.organizer.avatarUrl }} style={styles.organizerAvatar} />
              <View style={styles.organizerInfo}>
                <View style={styles.organizerNameRow}>
                  <Text style={styles.organizerName}>{event.organizer.name}</Text>
                  {event.organizer.isVerified && (
                    <Ionicons name="checkmark-circle" size={14} color={colors.amberPrimary} />
                  )}
                </View>
                <Text style={styles.organizerRole}>{event.organizer.role || 'Host'}</Text>
              </View>
            </View>
          </View>

          {/* Demonstration Notice */}
          {event.isSeedDemoData && (
            <View style={styles.demoNoticeCard}>
              <Ionicons name="information-circle-outline" size={18} color={colors.amberLight} />
              <Text style={styles.demoNoticeText}>
                This is a seeded demonstration listing for the VecnaVerse Hackathon showcasing Hyperlocal Event Discovery.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Sticky RSVP Bottom Bar */}
      <SafeAreaView style={styles.stickyBottomSafe}>
        <View style={styles.stickyBottom}>
          <View style={styles.priceColumn}>
            <Text style={styles.priceLabel}>Admission</Text>
            <Text style={styles.priceValue}>{event.price}</Text>
          </View>

          <TouchableOpacity
            style={[styles.rsvpButton, rsvpd && styles.rsvpButtonActive]}
            onPress={() => toggleRsvp(event.id)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={rsvpd ? 'checkmark-circle' : 'ticket-outline'}
              size={18}
              color={rsvpd ? colors.amberPrimary : colors.textOnAmber}
            />
            <Text style={[styles.rsvpButtonText, rsvpd && styles.rsvpButtonTextActive]}>
              {rsvpd ? "I'm Attending" : 'RSVP / Join'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorSafe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  backBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.amberPrimary,
    borderRadius: borderRadius.pill,
  },
  backBtnText: {
    color: colors.textOnAmber,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 110,
  },
  posterContainer: {
    width,
    height: 320,
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topNavSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  topNavRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(9, 11, 14, 0.75)',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButtonSaved: {
    borderColor: colors.amberPrimary,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  body: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  categoryPill: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  categoryPillText: {
    ...typography.micro,
    color: colors.amberPrimary,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    gap: 4,
  },
  verifiedPillText: {
    ...typography.micro,
    color: colors.success,
    fontSize: 10,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.borderGold,
    gap: 4,
  },
  demoPillText: {
    ...typography.micro,
    color: colors.amberLight,
    fontSize: 10,
  },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: 4,
  },
  distancePillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  title: {
    ...typography.hero,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  iconSquare: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  infoSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
  buddiesSection: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  buddiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  buddiesTitle: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  buddiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  buddyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingRight: spacing.sm,
    paddingLeft: 4,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  buddyAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  buddyName: {
    ...typography.caption,
    color: colors.textPrimary,
    fontSize: 12,
  },
  youChip: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: colors.amberPrimary,
    paddingHorizontal: spacing.sm,
  },
  youChipText: {
    ...typography.caption,
    color: colors.amberPrimary,
    fontWeight: '700',
    fontSize: 12,
  },
  emptyBuddiesText: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  sectionBlock: {
    marginTop: spacing.lg,
  },
  sectionHeading: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: spacing.md,
  },
  organizerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.amberPrimary,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  organizerName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  organizerRole: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  demoNoticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    padding: spacing.md,
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  demoNoticeText: {
    ...typography.caption,
    color: colors.amberLight,
    flex: 1,
    lineHeight: 18,
  },
  stickyBottomSafe: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfacePrimary,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  stickyBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  priceColumn: {
    justifyContent: 'center',
  },
  priceLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  priceValue: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  rsvpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.amberPrimary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.pill,
  },
  rsvpButtonActive: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.amberPrimary,
  },
  rsvpButtonText: {
    ...typography.bodyBold,
    color: colors.textOnAmber,
    fontWeight: '700',
  },
  rsvpButtonTextActive: {
    color: colors.amberPrimary,
  },
});
