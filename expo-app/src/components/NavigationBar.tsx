import { createContext, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HStack } from '@gluestack-ui/themed';
import { MaterialIcons } from '@expo/vector-icons';

import { AuthNavigationProp } from "@routes/auth.routes";

type NavbarContextType = {
  currentActive: string;
  setCurrentActive: (value: string) => void;
};

export const NavbarContext = createContext<NavbarContextType>({
  currentActive: "Home",
  setCurrentActive: () => {},
});

export function NavigationBar() {
  const [currentActive, setCurrentActive] = useState<NavbarContextType["currentActive"]>('Home');
  const navigation = useNavigation<AuthNavigationProp>();
  const navigationState = useNavigationState((state) => state);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (navigationState && navigationState.routes) {
      const currentRoute = navigationState.routes[navigationState.index]?.name;
      setCurrentActive(currentRoute);
    }
  }, [navigationState]);

  return (
    <HStack
      justifyContent="space-around"
      alignItems="center"
      bg="$white"
      p={4}
      pb={insets.bottom + 4}
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      h={47.5 + insets.bottom}
      borderTopWidth={2}
      borderColor='#2752B7'
    >
      <TouchableOpacity onPress={ () => { setCurrentActive('GenerateItinerary'); navigation.navigate('GenerateItinerary') } }>
        <MaterialIcons name="public" size={ currentActive === "GenerateItinerary" ? 40 : 30 } color={ currentActive === "GenerateItinerary" ? '#2752B7' : 'grey' } />
      </TouchableOpacity>
      <TouchableOpacity onPress={ () => { setCurrentActive('AIChat'); navigation.navigate('AIChat') } }>
        <MaterialIcons name="assistant" size={ currentActive === "AIChat" ? 40 : 30 } color={ currentActive === "AIChat" ? '#2752B7' : 'grey' } />
      </TouchableOpacity>
      <TouchableOpacity onPress={ () => { setCurrentActive('Home'); navigation.navigate('Home') } }>
        <MaterialIcons name="home" size={ currentActive === "Home" ? 40 : 30 } color={ currentActive === "Home" ? '#2752B7' : 'grey' } />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setCurrentActive('Settings'); navigation.navigate('Settings') }}>
        <MaterialIcons name="settings" size={ currentActive === "Settings" ? 40 : 30 } color={ currentActive === "Settings" ? '#2752B7' : 'grey' } />
      </TouchableOpacity>
      <TouchableOpacity onPress={ () => setCurrentActive('Games') }>
        <MaterialIcons name="sports-esports" size={ currentActive === "Games" ? 40 : 30 } color={ currentActive === "Games" ? '#2752B7' : 'grey' } />
      </TouchableOpacity>
    </HStack>
  );
}