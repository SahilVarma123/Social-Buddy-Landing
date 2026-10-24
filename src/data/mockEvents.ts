import { HyperlocalEvent, Coordinates } from '../types';

// Default center reference point (Downtown Tech & Arts District)
export const DEFAULT_USER_COORDINATES: Coordinates = {
  latitude: 12.9716,
  longitude: 77.5946,
};

export const DEMO_LOCATIONS = [
  {
    id: 'downtown',
    name: 'Indiranagar Tech & Arts Hub (Simulated)',
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
  },
  {
    id: 'campus',
    name: 'University Quad & Research Park (Simulated)',
    coordinates: { latitude: 12.9352, longitude: 77.6245 },
  },
  {
    id: 'north_quarter',
    name: 'North Innovation Corridor (Simulated)',
    coordinates: { latitude: 13.0358, longitude: 77.597 },
  },
];

export const MOCK_EVENTS: HyperlocalEvent[] = [
  // 1. MUSIC (Featured, Trending) ~1.1 km
  {
    id: 'ev-1',
    title: 'Neon Nights: Indie Rock Showcase',
    tagline: 'Live underground acoustic and synth rock performances',
    description:
      'Demonstration listing: A simulated indie rock showcase in an acoustic warehouse space. Demonstrates hyperlocal card presentation and audio-visual themed event tags.',
    category: 'Music',
    date: '2026-10-25',
    displayDate: 'SUN, OCT 25',
    time: '7:30 PM',
    venue: 'The Warehouse Arena (Sample Venue)',
    address: '42 Industrial Quarter, 8th Main',
    coordinates: { latitude: 12.9735, longitude: 77.5982 },
    imageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80',
    price: '$18',
    isFree: false,
    attendeeCount: 142,
    buddiesAttending: [
      { id: 'u1', name: 'Aria', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
      { id: 'u2', name: 'Dev', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
    ],
    organizer: {
      id: 'org-1',
      name: 'Echo Chamber Collective',
      avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120',
      isVerified: false,
      role: 'Simulated Organizer Profile',
    },
    isFeatured: true,
    isTrending: true,
    isUpcoming: false,
    isSeedDemoData: true,
    isVerifiedRealWorld: false,
  },

  // 2. WORKSHOPS (Featured, Upcoming) ~2.4 km
  {
    id: 'ev-2',
    title: 'Autonomous AI Builders Hack-Jam',
    tagline: 'Hands-on sprint building local on-device agents',
    description:
      'Demonstration listing: A collaborative jam session for developers exploring on-device agents, tool protocols, and edge compute models.',
    category: 'Workshops',
    date: '2026-10-26',
    displayDate: 'MON, OCT 26',
    time: '10:00 AM',
    venue: 'BaseCamp Innovation Hub (Sample Venue)',
    address: 'Level 3, Tech Park Central',
    coordinates: { latitude: 12.9782, longitude: 77.5912 },
    imageUrl:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80',
    price: 'Free',
    isFree: true,
    attendeeCount: 88,
    buddiesAttending: [
      { id: 'u3', name: 'Kiran', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
    ],
    organizer: {
      id: 'org-2',
      name: 'VecnaDev Community',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
      isVerified: false,
      role: 'Simulated Organizer Profile',
    },
    isFeatured: true,
    isTrending: false,
    isUpcoming: true,
    isSeedDemoData: true,
    isVerifiedRealWorld: false,
  },

  // 3. COMEDY (Trending) ~0.9 km
  {
    id: 'ev-3',
    title: 'Midnight Stand-Up & Open Mic',
    tagline: 'Laughs, craft brews & unreleased bits',
    description:
      'Demonstration listing: An intimate evening of stand-up comedy and open-mic showcase designed to test walking-distance discovery (under 1 km).',
    category: 'Comedy',
    date: '2026-10-27',
    displayDate: 'TUE, OCT 27',
    time: '9:00 PM',
    venue: 'Velvet Cellar Club (Sample Venue)',
    address: '88 Church Street Basement',
    coordinates: { latitude: 12.9692, longitude: 77.6015 },
    imageUrl:
      'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=900&auto=format&fit=crop&q=80',
    price: '$12',
    isFree: false,
    attendeeCount: 64,
    buddiesAttending: [],
    organizer: {
      id: 'org-3',
      name: 'The Punchline Guild',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120',
      isVerified: false,
      role: 'Simulated Organizer Profile',
    },
    isFeatured: false,
    isTrending: true,
    isUpcoming: false,
    isSeedDemoData: true,
    isVerifiedRealWorld: false,
  },

  // 4. COLLEGE (Trending, Upcoming) ~3.8 km
  {
    id: 'ev-4',
    title: 'Inter-College Robo-Wars 2026',
    tagline: 'Combat robotics and telemetry showdown',
    description:
      'Demonstration listing: Student combat robotics showcase featuring amateur pneumatic flippers and autonomous telemetry arenas.',
    category: 'College',
    date: '2026-10-28',
    displayDate: 'WED, OCT 28',
    time: '11:00 AM',
    venue: 'City Tech University Grounds (Sample Venue)',
    address: 'North Quad Gate 2, Ring Road',
    coordinates: { latitude: 12.986, longitude: 77.582 },
    imageUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=80',
    price: 'Free',
    isFree: true,
    attendeeCount: 310,
    buddiesAttending: [
      { id: 'u1', name: 'Aria', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
    ],
    organizer: {
      id: 'org-4',
      name: 'Student Engineering Council',
      avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120',
      isVerified: false,
      role: 'Simulated Campus Profile',
    },
    isFeatured: false,
    isTrending: true,
    isUpcoming: true,
    isSeedDemoData: true,
    isVerifiedRealWorld: false,
  },

  // 5. SPORTS (Trending) ~4.5 km
  {
    id: 'ev-5',
    title: 'Floodlit 3v3 Streetball Tournament',
    tagline: 'Street basketball tournament under the lights',
    description:
      'Demonstration listing: Fast-paced pickup games and shooting challenges on floodlit community courts.',
    category: 'Sports',
    date: '2026-10-29',
    displayDate: 'THU, OCT 29',
    time: '6:30 PM',
    venue: 'HoopPark Urban Courts (Sample Venue)',
    address: '14 Metro Overpass Plaza',
    coordinates: { latitude: 12.948, longitude: 77.618 },
    imageUrl:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&auto=format&fit=crop&q=80',
    price: '$5',
    isFree: false,
    attendeeCount: 180,
    buddiesAttending: [
      { id: 'u2', name: 'Dev', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
    ],
    organizer: {
      id: 'org-5',
      name: 'Metro Ballers League',
      avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120',
      isVerified: false,
      role: 'Simulated Organizer Profile',
    },
    isFeatured: true,
    isTrending: true,
    isUpcoming: false,
    isSeedDemoData: true,
    isVerifiedRealWorld: false,
  },

  // 6. MEETUPS (Upcoming) ~1.8 km
  {
    id: 'ev-6',
    title: 'Founders & Coffee Meetup',
    tagline: 'Casual networking for early-stage builders and designers',
    description:
      'Demonstration listing: Morning coffee roundtable for product designers and indie hackers sharing prototypes.',
    category: 'Meetups',
    date: '2026-10-30',
    displayDate: 'FRI, OCT 30',
    time: '8:30 AM',
    venue: 'Roast & Roast Cafe (Sample Venue)',
    address: '12th Cross, Indiranagar',
    coordinates: { latitude: 12.975, longitude: 77.608 },
    imageUrl:
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=900&auto=format&fit=crop&q=80',
    price: 'Free',
    isFree: true,
    attendeeCount: 45,
    buddiesAttending: [],
    organizer: {
      id: 'org-6',
      name: 'Coffee Founders Club',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120',
      isVerified: false,
      role: 'Simulated Community Host',
    },
    isFeatured: false,
    isTrending: false,
    isUpcoming: true,
    isSeedDemoData: true,
    isVerifiedRealWorld: false,
  },

  // 7. PARTIES (Featured, Upcoming) ~6.2 km
  {
    id: 'ev-7',
    title: 'Rooftop Twilight Beats & Neon Lounge',
    tagline: 'Deep house beats, skyline views & artisan mocktails',
    description:
      'Demonstration listing: Evening ambient DJ session on an open-air rooftop terrace testing 5–10 km range filtering.',
    category: 'Parties',
    date: '2026-10-31',
    displayDate: 'SAT, OCT 31',
    time: '6:00 PM',
    venue: 'SkyDeck Panorama (Sample Venue)',
    address: '24th Floor, Skyline Tower',
    coordinates: { latitude: 12.935, longitude: 77.615 },
    imageUrl:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop&q=80',
    price: '$25',
    isFree: false,
    attendeeCount: 220,
    buddiesAttending: [
      { id: 'u1', name: 'Aria', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
      { id: 'u3', name: 'Kiran', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
    ],
    organizer: {
      id: 'org-7',
      name: 'Skyline Nightlife Group',
      avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120',
      isVerified: false,
      role: 'Simulated Organizer Profile',
    },
    isFeatured: true,
    isTrending: true,
    isUpcoming: true,
    isSeedDemoData: true,
    isVerifiedRealWorld: false,
  },

  // 8. MUSIC (Extended Range - 18.5 km)
  {
    id: 'ev-8',
    title: 'Echo Valley Ambient Soundscape Festival',
    tagline: 'Open-air electronic modular synthesis under the stars',
    description:
      'Demonstration listing: Outdoor modular synth performances situated ~18 km outside the central hub to test mid-range discovery slider (15-25 km).',
    category: 'Music',
    date: '2026-11-01',
    displayDate: 'SUN, NOV 01',
    time: '4:00 PM',
    venue: 'Echo Valley Amphitheater (Sample Venue)',
    address: 'Valley Reserve Road, Outskirts',
    coordinates: { latitude: 13.12, longitude: 77.52 },
    imageUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&auto=format&fit=crop&q=80',
    price: '$30',
    isFree: false,
    attendeeCount: 195,
    buddiesAttending: [],
    organizer: {
      id: 'org-8',
      name: 'Ambient Valley Collective',
      avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=120',
      isVerified: false,
      role: 'Simulated Organizer Profile',
    },
    isFeatured: false,
    isTrending: false,
    isUpcoming: true,
    isSeedDemoData: true,
    isVerifiedRealWorld: false,
  },

  // 9. WORKSHOPS (College & Skills) ~14.2 km
  {
    id: 'ev-9',
    title: 'Hardware Hacking: Microcontrollers & Sensors',
    tagline: 'Soldering, ESP32 firmware, and sensor integration',
    description:
      'Demonstration listing: Hands-on electronics prototyping workshop situated in the East tech corridor (~14 km away).',
    category: 'Workshops',
    date: '2026-11-02',
    displayDate: 'MON, NOV 02',
    time: '2:00 PM',
    venue: 'MakerSpace East Labs (Sample Venue)',
    address: 'Building B, Whitefield Tech Zone',
    coordinates: { latitude: 12.98, longitude: 77.72 },
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&auto=format&fit=crop&q=80',
    price: '$15',
    isFree: false,
    attendeeCount: 38,
    buddiesAttending: [
      { id: 'u2', name: 'Dev', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
    ],
    organizer: {
      id: 'org-9',
      name: 'Hardware Hacker Guild',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
      isVerified: false,
      role: 'Simulated Organizer Profile',
    },
    isFeatured: false,
    isTrending: true,
    isUpcoming: true,
    isSeedDemoData: true,
    isVerifiedRealWorld: false,
  },

  // 10. COLLEGE (Upcoming) ~32.0 km
  {
    id: 'ev-10',
    title: 'State Collegiate Hackathon Finale',
    tagline: '36-hour non-stop student innovation marathon',
    description:
      'Demonstration listing: Inter-university competition situated ~32 km away to validate 35–50 km metro-wide radius filtering.',
    category: 'College',
    date: '2026-11-06',
    displayDate: 'FRI, NOV 06',
    time: '9:00 AM',
    venue: 'North State Tech Auditorium (Sample Venue)',
    address: 'Campus Highway Junction 9',
    coordinates: { latitude: 13.25, longitude: 77.68 },
    imageUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&auto=format&fit=crop&q=80',
    price: 'Free',
    isFree: true,
    attendeeCount: 520,
    buddiesAttending: [
      { id: 'u1', name: 'Aria', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
      { id: 'u3', name: 'Kiran', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
    ],
    organizer: {
      id: 'org-10',
      name: 'All-State Tech Federation',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120',
      isVerified: false,
      role: 'Simulated Campus Profile',
    },
    isFeatured: false,
    isTrending: false,
    isUpcoming: true,
    isSeedDemoData: true,
    isVerifiedRealWorld: false,
  },
];
