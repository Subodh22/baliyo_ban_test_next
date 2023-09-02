import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SpecificDayComp from '../components/SpecificDayComp';
import { RootStackParamList } from './RootNavigator';
import { trpc } from '../utils/trpc';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card } from '@rneui/base';

type Set = {
  exerciseId: number;
  id: number;
  name: string;
  order: number;
  restTime: string;
  type: string;
  volume: string;
  weight: string;
};

type Exercise = {
  id: number;
  name: string;
  type: string;
  setType: string | null;
  order: number;
  routineId: number;
  sets: Set[];
};

type Routine = {
  id: number;
  weekRoutine: string;
  exercises: Exercise[];
  order: number;
};

type Celeb = {
  id: number;
  name: string;
  ratings: string;
  routines: Routine[];
} | null | undefined;

type personalSetType={
  exerciseId: number;
  id: number;
  name: string;
  order: number;
  RestTime: string;
  type: string;
  reps: string;
  weight: string;
  RestType:string;
  SetId:string
  WorkoutCelebId:string;
  personId:string;

}
type CustomScreenRouteProp = RouteProp<RootStackParamList, "Custom">;

type InsidenProp = NativeStackNavigationProp<RootStackParamList, 'Custom'>;

type SpecificScreenRouteProp = RouteProp<RootStackParamList, "Specific">;
 
function SpecificNavigator() {
  const navigation = useNavigation<InsidenProp> ();
  const { params: { WorkoutCelebId: workoutCelebId, name } } = useRoute<SpecificScreenRouteProp>();
  const {data:response,isLoading:isPosting} = trpc.post.getWorkoutData.useQuery({ workoutId: workoutCelebId },
    { keepPreviousData: true })
  
  
  // useEffect(()=>{
    
   
    
       
  // },[response ])
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, []);
 
  
    return (<View> 
      {response?.routines.map((routine) => (
       <View key={routine.id}> 
<TouchableOpacity
         className="px-5 py-4" 
        onPress={()=>{navigation.push('Inside',{routineId:routine.id,nameOfDay:routine.weekRoutine,workoutCelebId:workoutCelebId})}}>
           
       
          <View className="flex-row justify-between">
            <View className="flex items-center justify-center">
            <Text className='text-black text-[18px]  font-light tracking-tight'>{routine.weekRoutine}</Text>
            </View>
            </View>
            
            </TouchableOpacity>
   <Card.Divider />
   </View> 

        ))} 
        
        </View>
    )
}

export default SpecificNavigator;
