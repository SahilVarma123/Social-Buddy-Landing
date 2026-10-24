import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '../context/EventsContext';
import { useLocation } from '../context/LocationContext';
import { calculateDistanceKm } from '../utils/distance';
import { EventGridCard } from '../components/EventGridCard';
import { RootStackParamList } from '../types';
import { colors, spacing, borderRadius, typography } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SavedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { allEvents, savedIds, isSaved, toggleSave } = useEvents();
  const { userCoordinates } = useLocation();

  const savedEvents = allEvents
    .filter((event) => savedIds.includes(event.id))
    .map((event) => ({
      ...event,
      distanceKm: calculateDistanceKm(userCoordinates, event.coordinates),
    }));

  const handleCardPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Events</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {savedEvents.length} bookmarked
          </Text>
        </View>
      </View>

      {savedEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="bookmark-outline" size={32} color={colors.amberPrimary} />
          </View>
          <Text style={styles.emptyTitle}>No saved events yet</Text>
          <Text style={styles.emptySubtitle}>
            Bookmark gigs, workshops, or campus activities from the discovery feed to keep them easily accessible.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Ionicons name="compass-outline" size={16} color={colors.textOnAmber} />
            <Text style={styles.exploreBtnText}>Explore Events</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={savedEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventGridCard
              event={item}
              isSaved={isSaved(item.id)}
              onPress={() => handleCardPress(item.id)}
              onBookmarkPress={() => toggleSave(item.id)}
              variant="horizontal"
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  countBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  countText: {
    ...typography.caption,
    color: colors.amberPrimary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.amberPrimary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.pill,
  },
  exploreBtnText: {
    ...typography.bodyBold,
    color: colors.textOnAmber,
    fontWeight: '700',
  },
});
