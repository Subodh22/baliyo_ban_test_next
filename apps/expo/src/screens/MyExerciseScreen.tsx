import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Card } from '@rneui/base'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabParamList } from '../Navigator/TabNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../Navigator/RootNavigator'
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
type routines={
    id:number,
    weekRoutine:string,
    exercises:exercises[],
    order:number,
    workoutCelebId:number
}
type workout={
  id:number,
  name:string,
  ratings:string,
  routines:routines[]
}|undefined|null
export type MyExerciseNavigationProp=CompositeNavigationProp<BottomTabNavigationProp<TabParamList,"MyExercise">,
NativeStackNavigationProp<RootStackParamList>>;
 

const MyExerciseScreen = () => {
  const { data: getPersonal, isLoading: isPosting } = trpc.post.getWorkoutToUser.useQuery();
  const navigation = useNavigation<MyExerciseNavigationProp>();
  const [arrayOfWorkoute, setArrayOfWorkoute] = useState<workout[]>([]);
  const workoutIds = getPersonal?.map((personal) => personal.WorkoutCelebId) || [];
 
 
  if (isPosting ) {
    return <Text>Loading...</Text>;
  }
  if(!isPosting){
    console.log(getPersonal)
  }


  return (
    <ScrollView>
        {/* <TouchableOpacity onPress={navigation.goBack} className='absolute right-5 top-5 z-10'>
            <Icon name='closecircle' type='antdesign'/>
        </TouchableOpacity> */}
   
      {getPersonal?.map((specific) => (
        <View key={specific?.id}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Specific', { name: specific.WorkoutName,WorkoutCelebId:specific.WorkoutCelebId })}
            className="px-5 py-4"
          >
            <View className="flex-row justify-between">
              <View className="flex items-center justify-center">
                <Text>{specific.WorkoutName}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <Card.Divider />
        </View>
      ))}
  
    
    </ScrollView>
  )
}

export default MyExerciseScreen