import { View, Text, Pressable, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { HeadScreenNavigationProp } from '../screens/HeadScreen';
import {Button} from 'react-native-elements';
import { Card } from '@rneui/base';
import { trpc } from '../utils/trpc';
import { MyContext } from '../Navigator/RootNavigator';
 type props ={
    challengeid:number
    name : string;
    alreadyAdded:boolean,

     
 }
const ChallengesHeadScreen = ({name,challengeid,alreadyAdded,challengeStatus,refetch,userChallenge}:any) => {
      
   const context = useContext(MyContext)
  
   
      
      const [status,setStatus]=useState<any>(false);
      
      useEffect(()=>{
        setStatus(alreadyAdded)

      })
      const handlePress =async()=>
      {
       
        

        const answer=challengeStatus.mutate({
            id:challengeid,
            name:name,
            expoPushToken:context.expoPushToken,
            active:userChallenge>0?"notactive":"active"
           
            
        },{onSuccess:()=>
        {
          refetch()
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
            <TouchableOpacity onPress={()=>{
              if(!status){
                handlePress()
              }else{
                alert("Aleardy added")
              }
            }}>
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