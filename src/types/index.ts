export type EventCategory =
  | 'All'
  | 'Music'
  | 'Comedy'
  | 'Workshops'
  | 'College'
  | 'Sports'
  | 'Meetups'
  | 'Parties';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BuddyAttendee {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface EventOrganizer {
  id: string;
  name: string;
  avatarUrl: string;
  isVerified: boolean;
  role?: string;
}

export interface HyperlocalEvent {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: EventCategory;
  date: string; // ISO format or date string
  displayDate: string;
  time: string;
  venue: string;
  address: string;
  coordinates: Coordinates;
  distanceKm?: number;
  imageUrl: string;
  price: string;
  isFree: boolean;
  attendeeCount: number;
  buddiesAttending: BuddyAttendee[];
  organizer: EventOrganizer;
  isFeatured?: boolean;
  isTrending?: boolean;
  isUpcoming?: boolean;
  isSeedDemoData: boolean;
  isVerifiedRealWorld: boolean;
}

export type RootTabParamList = {
  Discover: undefined;
  Radar: undefined;
  Saved: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  EventDetail: { eventId: string };
};
