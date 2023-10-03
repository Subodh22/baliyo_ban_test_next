import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../Navigator/TabNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
 
import DayComponent from '../components/DayComponent';
import { trpc } from '../utils/trpc';
import { RootStackParamList } from '../types/NavigationTypes';

type SpecificScreenRouteProp = RouteProp<RootStackParamList,"Specific">;
export type MyExerciseNavigationProp=CompositeNavigationProp<BottomTabNavigationProp<TabParamList,"MyExercise">,
NativeStackNavigationProp<RootStackParamList>>;


const SpecificScreen = () => {
  const navigation = useNavigation<MyExerciseNavigationProp>()
  // const route = useRoute<SpecificScreenRouteProp>
  const {params:{WorkoutCelebId:WorkoutCelebId,name:name}}=useRoute<SpecificScreenRouteProp>();
  const { data: response, isLoading:isOning } =  trpc.post.getWorkoutData.useQuery({ workoutId:WorkoutCelebId });
  
  console.log(name)
  useLayoutEffect(()=>{
    navigation.setOptions({
      headerTitle:name
    })

  },[])

  
  return (
    <ScrollView>
    
             {response?.routines.map(({weekRoutine,id,exercises,order})=>(
               <DayComponent key={id} id={id} weekRoutine={weekRoutine} exercises={exercises} order={order} />
             ))}
      
    </ScrollView>
  )
}

export default SpecificScreen