import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Header } from '../components/Header';
import { FeaturedEventCard } from '../components/FeaturedEventCard';
import { RadiusFilter } from '../components/RadiusFilter';
import { MOCK_EVENTS, DEFAULT_USER_COORDINATES } from '../data/mockEvents';
import { calculateDistanceKm, formatDistance } from '../utils/distance';
import { colors, spacing, borderRadius, typography } from '../theme';

export const DiscoverScreen: React.FC = () => {
  const [selectedRadius, setSelectedRadius] = useState<number>(10);

  // Compute live distances from user coordinates
  const eventsWithDistance = useMemo(() => {
    return MOCK_EVENTS.map((event) => {
      const dist = calculateDistanceKm(DEFAULT_USER_COORDINATES, event.coordinates);
      return {
        ...event,
        distanceKm: dist,
      };
    });
  }, []);

  // Filter based on active radius
  const filteredEvents = useMemo(() => {
    return eventsWithDistance.filter(
      (ev) => (ev.distanceKm ?? 0) <= selectedRadius
    );
  }, [eventsWithDistance, selectedRadius]);

  const featuredEvents = useMemo(() => {
    return filteredEvents.filter((ev) => ev.isFeatured);
  }, [filteredEvents]);

  const trendingEvents = useMemo(() => {
    return filteredEvents.filter((ev) => !ev.isFeatured || ev.isTrending);
  }, [filteredEvents]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        locationName="Indiranagar Tech District"
        radiusKm={selectedRadius}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Interactive Radius Filter */}
        <RadiusFilter
          currentRadius={selectedRadius}
          onRadiusChange={setSelectedRadius}
          matchCount={filteredEvents.length}
        />

        {/* Featured Events Carousel */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Featured Spotlights</Text>
              <Text style={styles.sectionSubtitle}>Hand-picked events right in your circle</Text>
            </View>
          </View>

          <FlatList
            horizontal
            data={featuredEvents.length > 0 ? featuredEvents : eventsWithDistance.slice(0, 2)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FeaturedEventCard event={item} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
            snapToInterval={280}
            decelerationRate="fast"
          />
        </View>

        {/* Trending Events Near You */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Trending Near You</Text>
              <Text style={styles.sectionSubtitle}>Highest community engagement this week</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            {trendingEvents.map((item) => (
              <View key={item.id} style={styles.compactCard}>
                <View style={styles.compactContent}>
                  <View style={styles.tagRow}>
                    <Text style={styles.compactCategory}>{item.category}</Text>
                    {item.distanceKm !== undefined && (
                      <Text style={styles.compactDistance}>
                        • {formatDistance(item.distanceKm)}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.compactTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.compactVenue} numberOfLines={1}>
                    {item.venue} • {item.displayDate}
                  </Text>
                </View>
                <View style={styles.compactPriceBadge}>
                  <Text style={styles.compactPriceText}>{item.price}</Text>
                </View>
              </View>
            ))}
          </View>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxxl,
  },
  sectionContainer: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  horizontalListContent: {
    paddingHorizontal: spacing.lg,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceCard,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  compactContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  compactCategory: {
    ...typography.micro,
    color: colors.amberPrimary,
  },
  compactDistance: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  compactTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  compactVenue: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  compactPriceBadge: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  compactPriceText: {
    ...typography.caption,
    color: colors.amberPrimary,
    fontWeight: '700',
  },
});
