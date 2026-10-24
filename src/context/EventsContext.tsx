import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { HyperlocalEvent } from '../types';
import { MOCK_EVENTS } from '../data/mockEvents';

interface EventsContextType {
  savedIds: string[];
  rsvpIds: string[];
  toggleSave: (eventId: string) => Promise<void>;
  isSaved: (eventId: string) => boolean;
  toggleRsvp: (eventId: string) => Promise<void>;
  isRsvpd: (eventId: string) => boolean;
  getEventAttendeeCount: (event: HyperlocalEvent) => number;
  getEventById: (eventId: string) => HyperlocalEvent | undefined;
  allEvents: HyperlocalEvent[];
}

const STORAGE_KEY_SAVED = '@social_buddy_saved_ids';
const STORAGE_KEY_RSVP = '@social_buddy_rsvp_ids';

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [rsvpIds, setRsvpIds] = useState<string[]>([]);

  // Load persisted states on mount
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const [savedData, rsvpData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_SAVED),
          AsyncStorage.getItem(STORAGE_KEY_RSVP),
        ]);
        if (savedData) {
          setSavedIds(JSON.parse(savedData));
        }
        if (rsvpData) {
          setRsvpIds(JSON.parse(rsvpData));
        }
      } catch (e) {
        // Fallback silently if storage read fails
        console.warn('Failed to load local saved events', e);
      }
    };

    loadPersistedData();
  }, []);

  const toggleSave = useCallback(
    async (eventId: string) => {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics fallback
      }

      setSavedIds((prev) => {
        const updated = prev.includes(eventId)
          ? prev.filter((id) => id !== eventId)
          : [...prev, eventId];
        AsyncStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated)).catch((e) =>
          console.warn('Failed to save to storage', e)
        );
        return updated;
      });
    },
    []
  );

  const toggleRsvp = useCallback(
    async (eventId: string) => {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Haptics fallback
      }

      setRsvpIds((prev) => {
        const updated = prev.includes(eventId)
          ? prev.filter((id) => id !== eventId)
          : [...prev, eventId];
        AsyncStorage.setItem(STORAGE_KEY_RSVP, JSON.stringify(updated)).catch((e) =>
          console.warn('Failed to save RSVP to storage', e)
        );
        return updated;
      });
    },
    []
  );

  const isSaved = useCallback(
    (eventId: string) => savedIds.includes(eventId),
    [savedIds]
  );

  const isRsvpd = useCallback(
    (eventId: string) => rsvpIds.includes(eventId),
    [rsvpIds]
  );

  const getEventAttendeeCount = useCallback(
    (event: HyperlocalEvent) => {
      const userAttending = rsvpIds.includes(event.id);
      return event.attendeeCount + (userAttending ? 1 : 0);
    },
    [rsvpIds]
  );

  const getEventById = useCallback((eventId: string) => {
    return MOCK_EVENTS.find((e) => e.id === eventId);
  }, []);

  return (
    <EventsContext.Provider
      value={{
        savedIds,
        rsvpIds,
        toggleSave,
        isSaved,
        toggleRsvp,
        isRsvpd,
        getEventAttendeeCount,
        getEventById,
        allEvents: MOCK_EVENTS,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = (): EventsContextType => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
