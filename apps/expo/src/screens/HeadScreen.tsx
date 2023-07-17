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
  const [celeb_workout,setCeleb_workout] = useState([{ id: 24, name: 'Chris Bumstead', ratings: '4' },
  { id: 25, name: 'Tom Platz', ratings: '6' },
  { id: 26, name: 'Ronnie Coleman', ratings: '8' },
  { id: 27, name: 'Ronnie Coleman', ratings: '8' },
  { id: 28, name: 'Ronnie Coleman', ratings: '8' },
  { id: 29, name: 'Ronnie Coleman', ratings: '8' },
  { id: 30, name: 'Ronnie Coleman', ratings: '8' },
  { id: 31, name: 'Ronnie Coleman', ratings: '8' }])
  const getData =  trpc.post.all.useQuery();
  
  if(!getData) return <div>Loading..</div>
   

  useLayoutEffect(()=>{
    navigation.setOptions({
      headerShown:false
    })
  })
  return (
    <ScrollView >
      
    <Input value={input} placeholder='Search for your workout' onChangeText={setInput} className='bg-white pt-5 pb-0 px 1 '/> 
    <Button   title="Search"  titleStyle={{ color: 'black' }}/>
    {
      getData["data"]?.map(({id,name,ratings})=>(
          <Workout_celeb key={id} workoutId={id} name={name} ratings={ratings}/>
      ))
    }
       
     
    </ScrollView>
  )
}

export default HeadScreen