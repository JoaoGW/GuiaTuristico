import { useState, useEffect, createContext } from 'react';
import { Platform } from 'react-native';

import * as Device from 'expo-device';
import * as Location from 'expo-location';

import { Text } from '@gluestack-ui/themed';

type LocationContextType = {
  location: Location.LocationObject | null
  errorMsg: string | null
}

export const LocationContext = createContext<LocationContextType>({
  location: null,
  errorMsg: null
});

export const ProvideUserLocation = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<LocationContextType["location"]>(null);
  const [errorMsg, setErrorMsg] = useState<LocationContextType["errorMsg"]>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  let information = 'Waiting...';

  if (errorMsg) {
    information = errorMsg;
  } else if (location) {
    information = JSON.stringify(location);
  }

  return(
    <LocationContext.Provider value={{ location, errorMsg }}>
      {children}
      <Text>{information}</Text> { /** Transform this to a Gluestack Toast */ }
    </LocationContext.Provider>
  )
}