import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme, LinkingOptions } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { LocationProvider } from './src/context/LocationContext';
import { EventsProvider } from './src/context/EventsContext';
import { colors } from './src/theme';

const appNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surfacePrimary,
    text: colors.textPrimary,
    border: colors.borderSubtle,
    primary: colors.amberPrimary,
  },
};

const linking: LinkingOptions<any> = {
  prefixes: ['socialbuddy://', 'intent://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Discover: 'discover',
          Radar: 'radar',
          Saved: 'saved',
          Profile: 'profile',
        },
      },
      EventDetail: 'event/:eventId',
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <LocationProvider>
        <EventsProvider>
          <NavigationContainer theme={appNavigationTheme} linking={linking}>
            <RootNavigator />
            <StatusBar style="light" />
          </NavigationContainer>
        </EventsProvider>
      </LocationProvider>
    </SafeAreaProvider>
  );
}
