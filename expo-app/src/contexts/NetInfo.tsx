import { createContext, useEffect, useState } from "react";

import NetInfo from '@react-native-community/netinfo';

type NetInfoContextType = {
  isConnected: boolean | null
}

export const NetInfoContext = createContext<NetInfoContextType>({
  isConnected: null
})

/**
 * Provides network connectivity information to the application via context.
 * 
 * This component uses the `NetInfo` library to monitor the device's network
 * connectivity status and makes it available to its children through a context.
 * 
 * @param children - The child components that will have access to the network
 * connectivity context.
 * 
 * @returns A context provider that supplies the `isConnected` state to its children.
 * 
 * @remarks
 * - The `isConnected` state indicates whether the device is connected to a network.
 * - The `NetInfo.addEventListener` is used to observe network changes, and the
 * listener is cleaned up when the component unmounts.
 * 
 * @example
 * ```tsx
 * import { ProvideUserNetInfo } from './NetInfo';
 * 
 * const App = () => (
 *   <ProvideUserNetInfo>
 *     <YourComponent />
 *   </ProvideUserNetInfo>
 * );
 * ```
 */
export const ProvideUserNetInfo = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<NetInfoContextType["isConnected"]>(null);

  useEffect(() => {
    const observeNetwork = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected)
    });

    return () => {
      observeNetwork();
    };
  }, []);

  return(
    <NetInfoContext.Provider value={{ isConnected }}>
      { children }
    </NetInfoContext.Provider>
  )
}