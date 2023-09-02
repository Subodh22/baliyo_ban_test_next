import { useOAuth } from "@clerk/clerk-expo";
import React from "react";
import { Button, TouchableOpacity, View } from "react-native";
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";
import { Text } from "react-native-elements";

const useCustomOAuth = (strategy:any) => {
  const { startOAuthFlow } = useOAuth({ strategy });

  const handleSignIn = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
      } else {
        // Modify this code to use signIn or signUp to set the missing requirements you set in your dashboard.
        throw new Error("There are unmet requirements B, modify this else to handle them");
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
      <TouchableOpacity  className='h-[60px] mt-2 bg-yellow-300  justify-center items-center flex' onPress={handleSignInWithGoogle}>
        <Text className="text-black text-[18px]  font-light tracking-tight">
        Sign in with Google
        </Text>
      </TouchableOpacity>
       
      <TouchableOpacity  className='h-[60px] mt-2 bg-yellow-300  justify-center items-center flex'  onPress={handleSignInWithApple}>
        <Text className="text-black text-[18px]  font-light tracking-tight">
        Sign in with Apple
        </Text>
      </TouchableOpacity>
     
    </View>
  );
};

export default SignInWithOAuth;