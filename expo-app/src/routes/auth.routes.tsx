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
      <Stack.Screen 
        name="Home" 
        component={ HomeWithNavBar } 
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={ SettingsWithNavBar } 
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ Profile }
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="UserPreferences" 
        component={ UserPreferences }
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="GenerateItinerary" 
        component={ GenerateItineraryWithNavBar } 
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="AIChat" 
        component={ AIChatWithNavBar } 
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="MapsExpanded" 
        component={ MapsExpanded }
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={ Notifications }
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="DestinationDetail" 
        component={ DestinationDetails }
        options={{ animation: 'none' }}
      />
    </Stack.Navigator>
  );
}