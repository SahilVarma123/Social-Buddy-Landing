export type EventCategory =
  | 'All'
  | 'Concert'
  | 'Workshop'
  | 'College'
  | 'Comedy'
  | 'Sports'
  | 'Meetup';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BuddyAttendee {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface HyperlocalEvent {
  id: string;
  title: string;
  tagline: string;
  category: EventCategory;
  date: string; // ISO string or human string
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
  isFeatured?: boolean;
  isTrending?: boolean;
}

export type RootTabParamList = {
  Discover: undefined;
  Radar: undefined;
  Saved: undefined;
  Profile: undefined;
};
