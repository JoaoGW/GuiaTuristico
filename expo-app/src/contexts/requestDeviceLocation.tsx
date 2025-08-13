import { useState, useEffect, createContext } from 'react';
import { Platform } from 'react-native';

import * as Device from 'expo-device';
import * as Location from 'expo-location';

import { AlertToast } from '@components/Errors/AlertToast';

type LocationContextType = {
  location: Location.LocationObject | null
  errorMsg: string | null
}

export const LocationContext = createContext<LocationContextType>({
  location: null,
  errorMsg: null
});

/**
 * Provides the user's current location and any associated error messages to the application via context.
 * 
 * This component uses the `LocationContext` to share the user's location and error state with its children.
 * It requests the user's permission to access their location and retrieves the current position if granted.
 * 
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components that will consume the location context.
 * 
 * @returns {JSX.Element} A context provider wrapping the children components.
 * 
 * @remarks
 * - On Android emulators, this component will not work unless a physical device is used.
 * - If location permissions are denied, an error message will be set in the context.
 * - The `AlertToast` component is used to wrap the children, which may display alerts or notifications.
 * 
 * @example
 * ```tsx
 * <ProvideUserLocation>
 *   <YourComponent />
 * </ProvideUserLocation>
 * ```
 */
export const ProvideUserLocation = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<LocationContextType["location"]>(null);
  const [errorMsg, setErrorMsg] = useState<LocationContextType["errorMsg"]>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('This won\'t work in an Android Emulator.');
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        setLocation(await Location.getCurrentPositionAsync({}));
      } catch (error) {
        setErrorMsg(`Erro ao obter localização: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
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
      <AlertToast>
        { children }
      </AlertToast>
    </LocationContext.Provider>
  )
}