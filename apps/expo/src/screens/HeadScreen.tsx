import { View, Text, ScrollView   } from 'react-native'
import React, { useLayoutEffect, useState,useEffect } from 'react'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabParamList } from '../Navigator/TabNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../Navigator/RootNavigator'
import {Input,Button} from 'react-native-elements';
import Workout_celeb from '../components/Workout_celeb'
import { trpc } from '../utils/trpc'
import YoutubeEm from '../components/YoutubeEm'
 
export type HeadScreenNavigationProp=CompositeNavigationProp<
BottomTabNavigationProp<TabParamList,"Home">,
NativeStackNavigationProp<RootStackParamList>
>

type prope ={
  value:string,
  text:string
}
 
const HeadScreen = () => {
   
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
    <ScrollView className='pt-20' >
    
    {/* <Input value={input} placeholder='Search for your workout' onChangeText={setInput} className='bg-white pt-5 pb-0 px 1 '/> 
    <Button   title="Search"  titleStyle={{ color: 'black' }}/>
      */}
    {
      getData["data"]?.map(({id,name,ratings})=>(
         
          <Workout_celeb key={id} workoutId={id} name={name} ratings={ratings}/>
      ))
    }
       
     
    </ScrollView>
  )
}

export default HeadScreen