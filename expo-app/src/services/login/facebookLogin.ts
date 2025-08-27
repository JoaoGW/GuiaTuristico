import { TouchableOpacity, View } from "react-native";
import { useEffect } from "react";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import {
  AccessToken,
  Settings,
  Profile,
  LoginManager
} from "react-native-fbsdk-next";


useEffect(() => {
  const requestTracking = async () => {
    const { status } = await requestTrackingPermissionsAsync();

    Settings.initializeSDK();

    if (status === "granted") {
      await Settings.setAdvertiserTrackingEnabled(true);
    }
  };

  requestTracking();
}, []);

const getUserFBData = () => {
  Profile.getCurrentProfile().then((currentProfile) => {
    console.log(currentProfile);
  });
};

export const handleFacebookSignIn = () => {
  LoginManager.logInWithPermissions(["public_profile", "email"]).then(
    function (result) {
      if (result.isCancelled) {
        console.log("==> Login cancelled");
      } else {
        console.log(result);
        AccessToken.getCurrentAccessToken().then((data) => {
          console.log(data);
          getUserFBData();
        });
      }
    },
    function (error: string) {
      console.log("Login fail with error: " + error);
    }
  );
};