import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import {
  AccessToken,
  Settings,
  Profile,
  LoginManager
} from "react-native-fbsdk-next";

const initializeFacebookSDK = async () => {
  const { status } = await requestTrackingPermissionsAsync();

  Settings.initializeSDK();

  if (status === "granted") {
    await Settings.setAdvertiserTrackingEnabled(true);
  }
};

const getUserFBData = () => {
  Profile.getCurrentProfile().then((currentProfile) => {
    console.log(currentProfile);
  });
};

export const handleFacebookSignIn = async (setIsAuthenticating: (status: boolean) => void) => {
  setIsAuthenticating(true);

  try {
    await initializeFacebookSDK();

    const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
    
    if (result.isCancelled) {
      console.log("==> Login cancelled");
      setIsAuthenticating(false);
    } else {
      console.log(result);
      const data = await AccessToken.getCurrentAccessToken();
      if (data) {
        getUserFBData();
      }
      setIsAuthenticating(false);
    }
  } catch (error) {
    console.log("Login fail with error: " + error);
    setIsAuthenticating(false);
  }
};