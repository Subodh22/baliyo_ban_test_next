import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { trpc } from '../utils/trpc'
import { Clerk, useAuth, useUser} from '@clerk/clerk-expo'
import { Image } from 'react-native-elements'
import { Button } from '@rneui/base'
import { useMutation } from 'react-query';

const SignOut = () => {
  const { signOut } = useAuth();
  return (
    <View>

      <TouchableOpacity  className='h-10 mb-3  justify-center items-center bg-yellow-300  flex-row ' onPress={() => {
          signOut();
        }}>
        <Text  className='text-black text-[20px] font-light tracking-tight' >
        Sign Out
        </Text>
      </TouchableOpacity>
      
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
    Alert.alert('Confirm','Are you sure you want to delete your account ?',
    [
      {text:'Cancel',
      style:'cancel'},
      {text:'Yes',
      onPress:async()=>{
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
    }

    ]
    )
  
}
  return(
    <TouchableOpacity  className='h-10 mb-3  justify-center items-center bg-yellow-300  flex-row '
    onPress={deleteAcc} >
    <Text  className='text-black text-[20px] font-light tracking-tight' >
    Delete Account
    </Text>
  </TouchableOpacity>
    
  )
} 

type StaticImport =   any
const PersonalScreen = () => {
  const {user} = useUser();
  
 
  const ll:string| StaticImport=user?.profileImageUrl
  const username= user?.fullName
  return (
    <View className='flex-col h-full gap-10' >
      <View className='flex-row m-2 justify-between items-center'> 
    <View >  
      <Text className=' bg-yellow-300 ml-1 text-black text-[20px] font-light tracking-tight'>{username}</Text></View>
      <View className='flex pr-2  justify-center items-center bg-gray-100'> 
      <View className='w-24 h-24 rounded-full overflow-hidden'> 
      <Image source={{uri:ll}}  className='w-full h-full'   />
      </View>
      </View>
      </View>

      <View> 
      <SignOut/>
     <DeleteButton/>
     </View>
    </View>
  )
}

export default  PersonalScreen