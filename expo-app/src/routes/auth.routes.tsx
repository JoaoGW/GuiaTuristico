import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Home } from "@screens/HomePage/Home";
import { Settings } from "@screens/UserProfile/Settings";
import { Profile } from "@screens/UserProfile/EditProfile";
import { UserPreferences } from "@screens/UserProfile/UserPreferences";
import { GenerateItinerary } from "@screens/Itinerary/GenerateItinerary";
import { AIChat } from "@screens/AIChat/AIChat";
import { AIMascotIntroduction } from "@screens/AIChat/AIMascotIntroduction";
import { AIChatMenu } from "@screens/AIChat/AIChatMenu";
import { MapsExpanded } from "@screens/HomePage/MapsExpanded";
import { Notifications } from "@screens/HomePage/Notifications";
import { DestinationDetails } from "@screens/HomePage/DestinationDetails";

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
  AIMascotIntroduction: undefined;
  AIChatMenu: undefined;
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

function AIChatMenuWithNavBar() {
  return (
    <ScreenWrapper>
      <AIChatMenu />
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
        name="AIMascotIntroduction" 
        component={ AIMascotIntroduction } 
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="AIChatMenu" 
        component={ AIChatMenuWithNavBar } 
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