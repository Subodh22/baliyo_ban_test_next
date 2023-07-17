import { View, Text, FlatList } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SpecificDayComp from '../components/SpecificDayComp';
import { RootStackParamList } from './RootNavigator';
import { trpc } from '../utils/trpc';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
type CustomScreenRouteProp = RouteProp<RootStackParamList, "Custom">;

type SpecificScreenRouteProp = RouteProp<RootStackParamList, "Specific">;

const Tab = createBottomTabNavigator();

function SpecificNavigator() {
  const navigation = useNavigation();
  const { params: { WorkoutCelebId: workoutCelebId, name } } = useRoute<SpecificScreenRouteProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, []);

  const ExerciseTab = () => {
    const {params}=useRoute<CustomScreenRouteProp>();
    const exercises=params?.exercises
   
    return (
      <FlatList
        data={exercises}
        keyExtractor={(item) => `${item.routineId}-${item.id}`}
        renderItem={({ item }) => (
          <View key={item.id}>
            <Text>{item.name}</Text>
            <FlatList
            data={item.sets}
            keyExtractor={(set) => `${item.routineId}-${item.id}-${set.id}`}
            renderItem={({ item: set }) => (
              <SpecificDayComp
                exerciseId={item.id}
                id={set.id}
                name={set.name}
                order={set.order}
                restTime={set.restTime}
                type={set.type}
                volume={set.volume}
                weight={set.weight}
                key={`${item.routineId}-${item.id}-${set.id}-s`}
              />
            )}
            
          />
          </View>
        )}
        initialNumToRender={2}
      />
    );
  };

  return (
    <Tab.Navigator screenOptions={()=>({
      lazy:true,
        lazyPreloadDistance:1
    })}>
        {trpc.post.getWorkoutData.useQuery({ workoutId: workoutCelebId }, { keepPreviousData: true }).data?.routines.map((routine, index) => (
        <Tab.Screen
          key={`Screen${index}`}
          name={routine.weekRoutine}
          component={ExerciseTab}
          initialParams={ routine }
        />
      ))}  <Tab.Screen
          key={`Screen${index}`}
          name={routine.weekRoutine}
          component={ExerciseTab}
          initialParams={ routine }
        />
      ))}
    </Tab.Navigator>
  );
}

export default SpecificNavigator;
