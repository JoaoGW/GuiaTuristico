import { createContext, useEffect, useState } from "react";

import NetInfo from '@react-native-community/netinfo';

type NetInfoContextType = {
  isConnected: boolean | null
}

export const NetInfoContext = createContext<NetInfoContextType>({
  isConnected: null
})

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