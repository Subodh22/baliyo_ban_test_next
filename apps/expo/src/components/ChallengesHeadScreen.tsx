import { View, Text, Pressable, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { HeadScreenNavigationProp } from '../screens/HeadScreen';
import {Button} from 'react-native-elements';
import { Card } from '@rneui/base';
import { trpc } from '../utils/trpc';
 type props ={
    challengeid:number
    name : string;
     
 }
const ChallengesHeadScreen = ({name,challengeid}:props) => {
      const {mutate,isLoading:isPosting} = trpc.post.addChallengesToUser.useMutation();
    //   const addPerosnalPlan=trpc.post.addPersonalPlan.useMutation();
    trpc.post.getUsersChallenge.useQuery();
    //   const [ref,setRef]=useState(false)
      const refresh = trpc.post.getUsersChallenge.useQuery();
      const [status,setStatus]=useState<any>(false);
      const handlePress =async()=>
      {
       
        const answer=mutate({
            id:challengeid,
            name:name
            
        },{onSuccess:()=>
        {
          refresh.refetch()
          setStatus(true)
        }}
        ) 
       
    }
    
     
  return (
  
<TouchableOpacity  >
    <View className="h-24 m-3 bg-white gap-1 shadow flex-row justify-between items-center p-4">
    <Text className="text-black text-[20px]  font-light tracking-tight">
    {name}
</Text>
        <View className="flex-col items-center gap-1"> 
            <TouchableOpacity onPress={handlePress}>
                <View className="items-center justify-center w-[75px] h-[35px] bg-yellow-300">
                    <Text className="text-black   font-light tracking-tight">{status ? "added" : "add"}</Text>
                </View>
            </TouchableOpacity>
           
        </View>
    </View>
</TouchableOpacity>

  )
}

export default ChallengesHeadScreen