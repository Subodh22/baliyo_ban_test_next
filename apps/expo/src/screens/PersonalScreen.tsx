import { View, Text } from 'react-native'
import React from 'react'
import { trpc } from '../utils/trpc'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { Image } from 'react-native-elements'
import { Button } from '@rneui/base'
 
const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View className="rounded-lg border-2 border-gray-500 p-4">
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};
type StaticImport =   any
const PersonalScreen = () => {
  const user = useUser();
  const ll:string| StaticImport=user.user?.profileImageUrl
  const username= user.user?.fullName
  return (
    <View>
      <Text>{user.user?.id}</Text>
      <Text>{username}</Text>
      <Image source={{uri:ll}}  style={{ width: 200, height: 200 }}   />
      <SignOut/>
    </View>
  )
}

export default  PersonalScreen