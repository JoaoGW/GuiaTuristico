import { createContext, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';

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
      pt={8}
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      h={50}
      borderTopWidth={2}
      borderColor='#e9ad2d'
    >
      <TouchableOpacity onPress={ () => { setCurrentActive('GenerateItinerary'); navigation.navigate('GenerateItinerary') } }>
        <MaterialIcons name="public" size={ currentActive === "GenerateItinerary" ? 40 : 30 } color={ currentActive === "GenerateItinerary" ? '#e9ad2d' : 'grey' } />
      </TouchableOpacity>
      <TouchableOpacity onPress={ () => setCurrentActive('Search') }>
        <MaterialIcons name="search" size={ currentActive === "Search" ? 40 : 30 } color={ currentActive === "Search" ? '#e9ad2d' : 'grey' } />
      </TouchableOpacity>
      <TouchableOpacity onPress={ () => { setCurrentActive('Home'); navigation.navigate('Home') } }>
        <MaterialIcons name="home" size={ currentActive === "Home" ? 40 : 30 } color={ currentActive === "Home" ? '#e9ad2d' : 'grey' } />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setCurrentActive('Settings'); navigation.navigate('Settings') }}>
        <MaterialIcons name="settings" size={ currentActive === "Settings" ? 40 : 30 } color={ currentActive === "Settings" ? '#e9ad2d' : 'grey' } />
      </TouchableOpacity>
      <TouchableOpacity onPress={ () => setCurrentActive('Games') }>
        <MaterialIcons name="sports-esports" size={ currentActive === "Games" ? 40 : 30 } color={ currentActive === "Games" ? '#e9ad2d' : 'grey' } />
      </TouchableOpacity>
    </HStack>
  );
}