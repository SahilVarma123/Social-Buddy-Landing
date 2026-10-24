import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { CategorySelector } from '../components/CategorySelector';
import { RadiusFilter } from '../components/RadiusFilter';
import { FeaturedEventCard } from '../components/FeaturedEventCard';
import { EventGridCard } from '../components/EventGridCard';
import { useEvents } from '../context/EventsContext';
import { useLocation } from '../context/LocationContext';
import { calculateDistanceKm } from '../utils/distance';
import { EventCategory, RootStackParamList } from '../types';
import { DEMO_LOCATIONS } from '../data/mockEvents';
import { colors, spacing, borderRadius, typography } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const DiscoverScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { allEvents, isSaved, toggleSave } = useEvents();
  const { userCoordinates, locationName, isUsingFallback, setDemoLocation } = useLocation();

  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [selectedRadius, setSelectedRadius] = useState<number>(15);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);

  // Calculate live distances relative to active user coordinates
  const eventsWithDistance = useMemo(() => {
    return allEvents.map((event) => {
      const dist = calculateDistanceKm(userCoordinates, event.coordinates);
      return {
        ...event,
        distanceKm: dist,
      };
    });
  }, [allEvents, userCoordinates]);

  // Combined Geospatial & Category Filter
  const filteredEvents = useMemo(() => {
    return eventsWithDistance.filter((event) => {
      const matchesRadius = (event.distanceKm ?? 0) <= selectedRadius;
      const matchesCategory =
        selectedCategory === 'All' || event.category === selectedCategory;
      return matchesRadius && matchesCategory;
    });
  }, [eventsWithDistance, selectedRadius, selectedCategory]);

  // Section 1: Featured
  const featuredEvents = useMemo(() => {
    return filteredEvents.filter((ev) => ev.isFeatured);
  }, [filteredEvents]);

  // Section 2: Trending Near You
  const trendingEvents = useMemo(() => {
    return filteredEvents.filter((ev) => ev.isTrending);
  }, [filteredEvents]);

  // Section 3: Upcoming
  const upcomingEvents = useMemo(() => {
    return filteredEvents.filter((ev) => ev.isUpcoming);
  }, [filteredEvents]);

  const handleCardPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        locationName={locationName}
        radiusKm={selectedRadius}
        eventCount={filteredEvents.length}
        onLocationPress={() => setShowLocationPicker((prev) => !prev)}
      />

      {/* Demo Location Switcher Sheet / Dropdown */}
      {showLocationPicker && (
        <View style={styles.locationDropdown}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>Select Discovery Location</Text>
            <TouchableOpacity onPress={() => setShowLocationPicker(false)}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.dropdownSubtitle}>
            Test hyperlocal distance filtering with realistic neighborhood coordinates:
          </Text>
          <View style={styles.demoLocationList}>
            {DEMO_LOCATIONS.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={styles.demoLocationItem}
                onPress={() => {
                  setDemoLocation(loc.id);
                  setShowLocationPicker(false);
                }}
              >
                <Ionicons name="location-sharp" size={16} color={colors.amberPrimary} />
                <Text style={styles.demoLocationName}>{loc.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Fallback indicator banner */}
      {isUsingFallback && (
        <View style={styles.demoBanner}>
          <Ionicons name="compass-outline" size={14} color={colors.amberLight} />
          <Text style={styles.demoBannerText}>
            Simulated campus & metro location active • Tap location header to switch hubs
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Horizontal Category Selector */}
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Continuous Radius Slider */}
        <RadiusFilter
          currentRadius={selectedRadius}
          onRadiusChange={setSelectedRadius}
          matchCount={filteredEvents.length}
        />

        {/* Empty State when no events match radius & category */}
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="radio-outline" size={32} color={colors.amberPrimary} />
            </View>
            <Text style={styles.emptyTitle}>No events in this radar range</Text>
            <Text style={styles.emptySubtitle}>
              No {selectedCategory !== 'All' ? selectedCategory.toLowerCase() : ''} events found
              within {selectedRadius} km. Try expanding the slider to 25 km or 50 km!
            </Text>
            <TouchableOpacity
              style={styles.expandRadiusBtn}
              onPress={() => setSelectedRadius(35)}
            >
              <Text style={styles.expandRadiusBtnText}>Expand Radar to 35 km</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Section 1: Cinematic Featured Carousel */}
            {featuredEvents.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>Featured Spotlights</Text>
                    <Text style={styles.sectionSubtitle}>
                      High-impact community events within {selectedRadius} km
                    </Text>
                  </View>
                </View>

                <FlatList
                  horizontal
                  data={featuredEvents}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <FeaturedEventCard
                      event={item}
                      isSaved={isSaved(item.id)}
                      onPress={() => handleCardPress(item.id)}
                      onBookmarkPress={() => toggleSave(item.id)}
                    />
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalListContent}
                  snapToInterval={280}
                  decelerationRate="fast"
                />
              </View>
            )}

            {/* Section 2: Trending Near You (Square / Portrait Cards) */}
            {trendingEvents.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>Trending Near You</Text>
                    <Text style={styles.sectionSubtitle}>
                      Popular with nearby circles and campuses
                    </Text>
                  </View>
                </View>

                <FlatList
                  horizontal
                  data={trendingEvents}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <EventGridCard
                      event={item}
                      isSaved={isSaved(item.id)}
                      onPress={() => handleCardPress(item.id)}
                      onBookmarkPress={() => toggleSave(item.id)}
                      variant="portrait"
                    />
                  )}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalListContent}
                />
              </View>
            )}

            {/* Section 3: Upcoming Events (List View) */}
            {upcomingEvents.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>Upcoming on Radar</Text>
                    <Text style={styles.sectionSubtitle}>
                      Next 14 days in your community
                    </Text>
                  </View>
                </View>

                <View style={styles.upcomingList}>
                  {upcomingEvents.map((item) => (
                    <EventGridCard
                      key={item.id}
                      event={item}
                      isSaved={isSaved(item.id)}
                      onPress={() => handleCardPress(item.id)}
                      onBookmarkPress={() => toggleSave(item.id)}
                      variant="horizontal"
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
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
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
    gap: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.15)',
  },
  demoBannerText: {
    ...typography.caption,
    color: colors.amberLight,
    fontSize: 11,
    flex: 1,
  },
  locationDropdown: {
    backgroundColor: colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGold,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    zIndex: 100,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dropdownTitle: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  dropdownSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: spacing.sm,
  },
  demoLocationList: {
    gap: spacing.xs,
  },
  demoLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.sm,
  },
  demoLocationName: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
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
  upcomingList: {
    paddingHorizontal: spacing.lg,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
    marginTop: spacing.xl,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  expandRadiusBtn: {
    backgroundColor: colors.amberPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.pill,
  },
  expandRadiusBtnText: {
    ...typography.caption,
    color: colors.textOnAmber,
    fontWeight: '700',
  },
});
