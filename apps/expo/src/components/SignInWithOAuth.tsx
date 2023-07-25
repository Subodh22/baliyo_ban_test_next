import { useOAuth } from "@clerk/clerk-expo";
import React from "react";
import { Button, View } from "react-native";
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";

const useCustomOAuth = (strategy:any) => {
  const { startOAuthFlow } = useOAuth({ strategy });

  const handleSignIn = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
      } else {
        // Modify this code to use signIn or signUp to set the missing requirements you set in your dashboard.
        throw new Error("There are unmet requirements, modify this else to handle them");
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log("error signing in", err);
    }
  }, []);

  return { handleSignIn };
};

const SignInWithOAuth = () => {
  useWarmUpBrowser();

  const { handleSignIn: handleSignInWithGoogle } = useCustomOAuth("oauth_google");

  const { handleSignIn: handleSignInWithApple } = useCustomOAuth("oauth_apple");

  return (
    <View  >
      <Button
        title="Sign in with Google"
        onPress={handleSignInWithGoogle}
      />
  
      <Button 
        title="Sign in with Apple"
        onPress={handleSignInWithApple}
      />
    </View>
  );
};

export default SignInWithOAuth;