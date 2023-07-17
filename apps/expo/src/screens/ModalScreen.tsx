import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Card } from '@rneui/base'
import SetShowComponent from '../components/SetShowComponent'
import DayComponent from '../components/DayComponent'
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabParamList } from '../Navigator/TabNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../Navigator/RootNavigator'
import { Icon } from 'react-native-elements'
import { trpc } from '../utils/trpc'

type set = {
  exerciseId:number,
  id:number,
  name:string,
  order:number,
  restTime:string,
  type:string,
  volume:string,
  weight:string
}
type exercises={
  id: number;
name: string;
type: string;
setType: string|null;
order: number;
routineId: number;
sets:set[];
}

type RoutineProp={
  id:number,
  weekRoutine:string,
  exercises:exercises[],
  order:number

}[]

 
type ModalScreenNavigationProp = CompositeNavigationProp<BottomTabNavigationProp<TabParamList>,
    NativeStackNavigationProp<RootStackParamList,"MyModal">>;


type ModalScreenRouteProp = RouteProp<RootStackParamList,"MyModal">
const ModalScreen = () => {
 
      const navigation = useNavigation<ModalScreenNavigationProp>()
      
      
     
      const {params:{name,workoutId,ratings}} =useRoute<ModalScreenRouteProp>()
      const {data:getWorkouts,isLoading:isGetting} = trpc.post.getWorkoutData.useQuery({workoutId:workoutId});

      let sortedData
      if(!isGetting&&getWorkouts!==null&&getWorkouts!==undefined){
        console.log(getWorkouts)
        sortedData = getWorkouts?.routines.sort((a,b)=>a.order-b?.order)
      }
      console.log("ds")
      // const sortedData = data.sort((a,b)=>a.order-b?.order)
    
  return (
    <View>
        <TouchableOpacity onPress={navigation.goBack} className='absolute right-5 top-5 z-10'>
            <Icon name='closecircle' type='antdesign'/>
        </TouchableOpacity>
    <View className='px-5 py-4 ' > 
            <View className='flex-row justify-between'> 
             <View className='flex items-center justify-center'>
                <Text >{workoutId}
                
                </Text></View> 
             <View className='flex-column items-center'> 
                <TouchableOpacity className='items-center justify-center w-20 h-10   rounded-lg bg-blue-500 el'>
                    <Text>Add</Text>
                </TouchableOpacity>
                <View className='bg-gray-300 w-10 flex items-center m-2 '> 
                <Text>{ratings}</Text></View>
                </View>
            </View> 
      </View>
      <Card.Divider/>
        <ScrollView>

             {sortedData?.map(({weekRoutine,id,exercises,order})=>(
               <DayComponent key={id} id={id} weekRoutine={weekRoutine} exercises={exercises} order={order} />
             ))}
        </ScrollView>
    </View>
  )
}

export default ModalScreen