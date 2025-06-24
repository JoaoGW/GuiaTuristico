import { NavigationContainer } from "@react-navigation/native";

import { NoAuthRoute } from "./noauth.routes";
import { AuthRoute } from "./auth.routes";
import { useAuth } from "@contexts/AuthContext";

export function Routes() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      { isAuthenticated ? <AuthRoute /> : <NoAuthRoute /> }
    </NavigationContainer>
  );
}