import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { HStack } from '@gluestack-ui/themed';
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from "@routes/auth.routes";

export function NavigationBar() {
  const [currentActive, setCurrentActive] = useState('Home');
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <HStack
      justifyContent="space-around"
      alignItems="center"
      bg="$white"
      p={4}
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      h={65}
      borderWidth={2}
      borderColor='#e9ad2d'
    >
      <TouchableOpacity onPress={ () => { setCurrentActive('Itinerary'); navigation.navigate('GenerateItinerary') } }>
        <MaterialIcons name="public" size={ currentActive === "Itinerary" ? 40 : 30 } color={ currentActive === "Itinerary" ? '#e9ad2d' : 'grey' } />
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