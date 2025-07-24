import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Home } from "@screens/Home";
import { Settings } from "@screens/Settings";
import { Profile } from "@screens/EditProfile";
import { UserPreferences } from "@screens/UserPreferences";
import { GenerateItinerary } from "@screens/GenerateItinerary";
import { AIChat } from "@screens/AIChat";
import { MapsExpanded } from "@screens/MapsExpanded";
import { Notifications } from "@screens/Notifications";
import { DestinationDetails } from "@screens/DestinationDetails";

import { NavigationBar } from "@components/NavigationBar";

import { Place } from '../../@types/PlacesTypes';

const Stack = createNativeStackNavigator();

type AuthStackParamList = {
  Home: undefined;
  Settings: undefined;
  Profile: undefined;
  GenerateItinerary: undefined;
  UserPreferences: undefined;
  AIChat: undefined;
  MapsExpanded: { places: Place[], loading: boolean };
  Notifications: undefined;
  DestinationDetail: { destinationId: number }
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NavigationBar />
    </>
  );
}

function HomeWithNavBar() {
  return (
    <ScreenWrapper>
      <Home />
    </ScreenWrapper>
  );
}

function SettingsWithNavBar() {
  return (
    <ScreenWrapper>
      <Settings />
    </ScreenWrapper>
  );
}

function GenerateItineraryWithNavBar() {
  return (
    <ScreenWrapper>
      <GenerateItinerary />
    </ScreenWrapper>
  );
}

function AIChatWithNavBar() {
  return (
    <ScreenWrapper>
      <AIChat />
    </ScreenWrapper>
  );
}

export function AuthRoute() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={ HomeWithNavBar } />
      <Stack.Screen name="Settings" component={ SettingsWithNavBar } />
      <Stack.Screen name="Profile" component={ Profile } />
      <Stack.Screen name="UserPreferences" component={ UserPreferences } />
      <Stack.Screen name="GenerateItinerary" component={ GenerateItineraryWithNavBar } />
      <Stack.Screen name="AIChat" component={ AIChatWithNavBar } />
      <Stack.Screen name="MapsExpanded" component={ MapsExpanded } />
      <Stack.Screen name="Notifications" component={ Notifications } />
      <Stack.Screen name="DestinationDetail" component={ DestinationDetails } />
    </Stack.Navigator>
  );
}