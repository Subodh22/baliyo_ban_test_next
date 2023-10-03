import { View, Text, ScrollView   } from 'react-native'
import React, { useLayoutEffect, useState,useEffect } from 'react'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabParamList } from '../Navigator/TabNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
 
import {Input,Button} from 'react-native-elements';
import Workout_celeb from '../components/Workout_celeb'
import { trpc } from '../utils/trpc'
import YoutubeEm from '../components/YoutubeEm'
import { usePushNotifications } from '../utils/usePushNotifications'
import { SafeAreaView } from 'react-native-safe-area-context'
import ChallengesHeadScreen from '../components/ChallengesHeadScreen'
import CameraComponent from '../components/CameraComponent'
import { RootStackParamList } from '../types/NavigationTypes'
 

 
export type HeadScreenNavigationProp=CompositeNavigationProp<
BottomTabNavigationProp<TabParamList,"Home">,
NativeStackNavigationProp<RootStackParamList>
>

type prope ={
  value:string,
  text:string
}
 
const HeadScreen = () => {
 
  const {expoPushToken} = usePushNotifications()

 
 
 
  const [input,setInput]=useState<string>('');
  const navigation =useNavigation<HeadScreenNavigationProp>()
   
  const getData =  trpc.post.all.useQuery();
 
  if(!getData) return <div>Loading..</div>
   

  useLayoutEffect(()=>{
    navigation.setOptions({
      headerShown:false
    })
  })
  return (
    <SafeAreaView>
   
    
        <ScrollView      >
 
    {
      getData["data"]?.map(({id,name,ratings,planType})=>(
       
          <Workout_celeb key={id} workoutId={id} name={name} ratings={ratings} planType={planType!==null ?planType:""}/>
           ))
    }
            
    </ScrollView>
    </SafeAreaView>
   
  )
}

export default HeadScreen