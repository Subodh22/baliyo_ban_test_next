import { View, Text } from 'react-native'
import React from 'react'
import { trpc } from '../utils/trpc'
import { Clerk, useAuth, useUser} from '@clerk/clerk-expo'
import { Image } from 'react-native-elements'
import { Button } from '@rneui/base'
import { useMutation } from 'react-query';

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
// const useDeleteUserData = () => {
//   const mutation = trpc.post.deleteUserData.useMutation()

//   return mutation;
// };
const DeleteButton =()=>{
  const {user} = useUser();
  const { signOut } = useAuth();
  const deleteMutation = trpc.post.deleteUserData.useMutation(); // Get the deleteUserData mutation

  const deleteAcc = async () => {
  try {
    if (!user) {
      console.error('User is not authenticated.');
      return;
    }

   
    await deleteMutation.mutateAsync();

    await user?.delete()

    signOut()
  } catch (error) {
    console.error('Error deleting account:', error);
  }
}
  return(
    <Button onPress={deleteAcc} title="delete Account" />
  )
} 

type StaticImport =   any
const PersonalScreen = () => {
  const {user} = useUser();
  
 
  const ll:string| StaticImport=user?.profileImageUrl
  const username= user?.fullName
  return (
    <View>
      <Text>{user?.id}</Text>
      <Text>{username}</Text>
      <Image source={{uri:ll}}  style={{ width: 200, height: 200 }}   />
      
      <SignOut/>
     <DeleteButton/>
    </View>
  )
}

export default  PersonalScreen