import { View, Text, TouchableOpacity, ScrollView, FlatList,RefreshControl} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Card } from '@rneui/base'
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabParamList } from '../Navigator/TabNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
 
import { trpc } from '../utils/trpc'
import LoadingHead from './LoadingHead'
import { RootStackParamList } from '../types/NavigationTypes'

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
  const { data: getPersonal, isLoading: isPosting,refetch } = trpc.post.getWorkoutToUser.useQuery({workerI:"fill"});
  const navigation = useNavigation<MyExerciseNavigationProp>();
  // const [arrayOfWorkoute, setArrayOfWorkoute] = useState<workout[]>([]);
  // const workoutIds = getPersonal?.map((personal) => personal.WorkoutCelebId) || [];
  const [refreshing,setRefreshing]=useState(false)
 
   const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch()
      .then(() => setRefreshing(false))
      .catch((error) => {
        console.error('Error refreshing data:', error);
        setRefreshing(false);
      });
  }, [refetch]);

  if (isPosting ) {
 
    return <LoadingHead/>
  }
  if(!isPosting){
   
   console.log(getPersonal)
  }
  
  return (
    
    <FlatList 
     refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
    }
      data = {getPersonal}
      keyExtractor={(item)=>`${item.id}`}
      ListEmptyComponent={() => (
        <View className='flex h-full w-full m-2 '>
          <View className='flex-row'> 
            <Text className='text-black text-[20px]  font-light tracking-tight'>Add your workout from </Text>
            <Text className='text-black text-[20px]  bg-yellow-300  font-light tracking-tight'>
              Home
            </Text>
          </View>
        </View>
      )}
      renderItem={({item})=>(<> 
         <View >
           
        <TouchableOpacity
          onPress={() => 
             {item.planType==""? navigation.navigate('Specific', {topicId:null, name: item.WorkoutName,WorkoutCelebId:item.WorkoutCelebId,planLength:0 ,planId:null,id:0,currentStatus:0,currentWeek:0 ,orderP:0 }):
             navigation.navigate('PlanScreenT',  { name: item.WorkoutName,WorkoutCelebId:item.WorkoutCelebId})
            }}
          className="px-5 py-4"
        >
          <View className="flex-row justify-between">
            <View className="flex items-center justify-center">
              <Text className='text-black text-[18px]  font-light tracking-tight'>{item.WorkoutName}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Card.Divider />
      </View> 
      </>
      )}
    
    
    />
       
  
  )
}

export default MyExerciseScreen