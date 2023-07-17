import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SpecificDayComp from '../components/SpecificDayComp';
import { RootStackParamList } from './RootNavigator';
import { trpc } from '../utils/trpc';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  
  
  useEffect(()=>{
    
   
    
       
  },[response ])
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, []);
 
  
    return (<View> 
      {response?.routines.map((routine) => (
        
       <TouchableOpacity key={routine.id} onPress={()=>{navigation.push('Inside',{routineId:routine.id,nameOfDay:routine.weekRoutine,workoutCelebId:workoutCelebId})}}>
        <Text>{routine.weekRoutine}</Text>
       </TouchableOpacity>
        ))} 
        
        </View>
    )
}

export default SpecificNavigator;
