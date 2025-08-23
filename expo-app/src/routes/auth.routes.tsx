import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Home } from "@screens/HomePage/Home";
import { Profile } from "@screens/UserProfile/Profile";
import { EditProfile } from "@screens/UserProfile/EditProfile";
import { UserPreferences } from "@screens/UserProfile/UserPreferences";
import { GenerateItinerary } from "@screens/Itinerary/GenerateItinerary";
import { GenerateItineraryFeaturesIntroduction } from "@screens/Itinerary/GenerateItineraryFeaturesIntroduction";
import { GenerateItineraryMenu } from "@screens/Itinerary/GenerateItineraryMenu";
import { AIChat } from "@screens/AIChat/AIChat";
import { AIVoiceChat } from "@screens/AIChat/AIVoiceChat";
import { AIMascotIntroduction } from "@screens/AIChat/AIMascotIntroduction";
import { AIChatMenu } from "@screens/AIChat/AIChatMenu";
import { MapsExpanded } from "@screens/HomePage/MapsExpanded";
import { Notifications } from "@screens/HomePage/Notifications";
import { DestinationDetails } from "@screens/HomePage/DestinationDetails";
import { PremiumPlans } from "@screens/Premium/PremiumPlans";
import { WelcomePremiumPlan } from "@screens/Premium/WelcomePremiumPlan";
import { ManagePremiumPlan } from "@screens/Premium/ManagePremiumPlan";
import { OptionsManagePremiumPlan } from "@screens/Premium/OptionsManagePremiumPlan";
import { CancelPremiumPlan } from "@screens/Premium/CancelPremiumPlan";

import { NavigationBar } from "@components/NavigationBar";

import { Place } from '../../@types/PlacesTypes';

const Stack = createNativeStackNavigator();

type AuthStackParamList = {
  Home: undefined;
  AIMascotIntroduction: undefined;
  AIChat: { chatId?: string, topic?: string } | undefined;
  AIChatMenu: undefined;
  AIVoiceChat: undefined;
  CancelPremiumPlan: undefined;
  DestinationDetail: { destinationId: number };
  EditProfile: undefined;
  GenerateItinerary: undefined;
  GenerateItineraryFeaturesIntroduction: undefined;
  GenerateItineraryMenu: undefined;
  ManagePremiumPlan: undefined;
  MapsExpanded: { places: Place[], loading: boolean };
  Notifications: undefined;
  OptionsManagePremiumPlan: undefined;
  PremiumPlans: undefined;
  Profile: undefined;
  Settings: undefined;
  UserPreferences: undefined;
  WelcomePremium: undefined;
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

function ProfileWithNavBar() {
  return (
    <ScreenWrapper>
      <Profile />
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

function GenerateItineraryMenuWithNavBar() {
  return (
    <ScreenWrapper>
      <GenerateItineraryMenu />
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

function AIVoiceChatWithNavBar() {
  return (
    <ScreenWrapper>
      <AIVoiceChat />
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

function ManagePremiumPlanWithNavBar(){
  return (
    <ScreenWrapper>
      <ManagePremiumPlan />
    </ScreenWrapper>
  )
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
        name="Profile" 
        component={ ProfileWithNavBar }
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={ EditProfile }
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="UserPreferences" 
        component={ UserPreferences }
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="GenerateItineraryFeaturesIntroduction" 
        component={ GenerateItineraryFeaturesIntroduction } 
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="GenerateItineraryMenu" 
        component={ GenerateItineraryMenuWithNavBar } 
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="GenerateItinerary" 
        component={ GenerateItineraryWithNavBar } 
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
        name="AIChat" 
        component={ AIChatWithNavBar } 
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="AIVoiceChat" 
        component={ AIVoiceChatWithNavBar } 
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
      <Stack.Screen 
        name="PremiumPlans" 
        component={ PremiumPlans }
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="WelcomePremium" 
        component={ WelcomePremiumPlan }
        options={{ animation: 'flip' }}
      />
      <Stack.Screen 
        name="ManagePremiumPlan" 
        component={ ManagePremiumPlanWithNavBar }
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="OptionsManagePremiumPlan" 
        component={ OptionsManagePremiumPlan }
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="CancelPremiumPlan" 
        component={ CancelPremiumPlan }
        options={{ animation: 'none' }}
      />
    </Stack.Navigator>
  );
}