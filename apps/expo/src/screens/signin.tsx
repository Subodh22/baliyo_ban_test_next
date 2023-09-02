import React from "react";

import { View, SafeAreaView } from "react-native";

import SignInWithOAuth from "../components/SignInWithOAuth";
import { Text } from "react-native-elements";

export const SignInSignUpScreen = () => {
  return (
    <SafeAreaView className="flex mt-80 ">
     <View className="flex-row m-2"> 
      <Text className="text-black text-[20px]  font-light tracking-tight">Welcome to </Text>
      <Text className=' text-[20px] bg-yellow-300   font-light tracking-tight  '>Baliyo</Text>
      
      </View>
      <View className="h-full w-full p-4">
        <SignInWithOAuth />
      </View>
    </SafeAreaView>
  );
};
