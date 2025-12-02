import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Home } from "@screens/HomePage/Home";
import { Profile } from "@screens/UserProfile/Profile";
import { EditProfile } from "@screens/UserProfile/EditProfile";
import { UserPreferences } from "@screens/UserProfile/UserPreferences";
import { GenerateItineraryMenu } from "@screens/Itinerary/GenerateItineraryMenu";
import { GenerateItineraryFeaturesIntroduction } from "@screens/Itinerary/GenerateItineraryFeaturesIntroduction";
import { GenerateItineraryPreferences } from "@screens/Itinerary/GenerateItineraryPreferences";
import { ItineraryMapMenu } from "@screens/Itinerary/ItineraryMapMenu";
import { AIChat } from "@screens/AIChat/AIChat";
import { AIVoiceChat } from "@screens/AIChat/AIVoiceChat";
import { AIMascotIntroduction } from "@screens/AIChat/AIMascotIntroduction";
import { AIChatMenu } from "@screens/AIChat/AIChatMenu";
import { MapsExpanded } from "@screens/HomePage/MapsExpanded";
import { Notifications } from "@screens/HomePage/Notifications";
import { DestinationDetails } from "@screens/HomePage/DestinationDetails";
import { RecommendedDestinations } from "@screens/HomePage/RecommendedDestinations";
import { PremiumPlans } from "@screens/Premium/PremiumPlans";
import { WelcomePremiumPlan } from "@screens/Premium/WelcomePremiumPlan";
import { ManagePremiumPlan } from "@screens/Premium/ManagePremiumPlan";
import { OptionsManagePremiumPlan } from "@screens/Premium/OptionsManagePremiumPlan";
import { CancelPremiumPlan } from "@screens/Premium/CancelPremiumPlan";
import { ItineraryVisaCheck } from "@screens/Itinerary/ItineraryVisaCheck";

import { NavigationBar } from "@components/NavigationBar";

import { Place } from '../../@types/PlacesTypes';
import { CreatingItinerary } from "../../@types/CreatingItinerary";
import { VisaModelTypes } from "../../@types/VisaModelTypes";

type AuthStackParamList = {
  Home:  { name: string, email: string, photo: string },
  AIMascotIntroduction: undefined,
  AIChat: { chatId?: string, topic?: string } | undefined,
  AIChatMenu: undefined,
  AIVoiceChat: undefined,
  CancelPremiumPlan: undefined,
  DestinationDetail: { destinationId: number },
  EditProfile: undefined,
  GenerateItineraryFeaturesIntroduction: undefined,
  GenerateItineraryMenu: undefined,
  GenerateItineraryPreferences: { title: CreatingItinerary["title"], dateBegin: CreatingItinerary["dateBegin"], dateEnd: CreatingItinerary["dateEnd"], days: CreatingItinerary["days"], continent: CreatingItinerary["continent"], countries: CreatingItinerary["countries"], originCountry: CreatingItinerary["originCountry"], contacts: CreatingItinerary["contacts"] },
  ItineraryMapMenu: { itineraryData: CreatingItinerary, userPreferences: string[], visaIssue: VisaModelTypes["results"] },
  ItineraryVisaCheck: { itineraryData: CreatingItinerary, userPreferences: string[] },
  ManagePremiumPlan: undefined,
  MapsExpanded: { places: Place[], loading: boolean },
  Notifications: undefined,
  OptionsManagePremiumPlan: undefined,
  PremiumPlans: undefined,
  Profile: undefined,
  RecommendedDestinations: undefined,
  Settings: undefined,
  UserPreferences: CreatingItinerary,
  WelcomePremium: undefined
};

export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const Stack = createNativeStackNavigator();

function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NavigationBar />
    </>
  );
}

function ProfileWithNavBar() {
  return (
    <ScreenWrapper>
      <Profile />
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

function ItineraryMapMenuWithNavBar() {
  return (
    <ScreenWrapper>
      <ItineraryMapMenu />
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
        component={ Home } 
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
        name="GenerateItineraryPreferences" 
        component={ GenerateItineraryPreferences } 
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="ItineraryMapMenu"
        component={ ItineraryMapMenuWithNavBar } 
        options={{ animation: 'none' }}
      />
      <Stack.Screen 
        name="ItineraryVisaCheck"
        component={ ItineraryVisaCheck } 
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
        name="RecommendedDestinations" 
        component={ RecommendedDestinations }
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