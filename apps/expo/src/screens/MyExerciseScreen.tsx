import { View, Text, TouchableOpacity, ScrollView, FlatList,RefreshControl} from 'react-native'
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
  const { data: getPersonal, isLoading: isPosting,refetch } = trpc.post.getWorkoutToUser.useQuery();
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
    return <Text>Loading...</Text>;
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
      renderItem={({item})=>(
        <View >
        <TouchableOpacity
          onPress={() => navigation.navigate('Specific', { name: item.WorkoutName,WorkoutCelebId:item.WorkoutCelebId })}
          className="px-5 py-4"
        >
          <View className="flex-row justify-between">
            <View className="flex items-center justify-center">
              <Text>{item.WorkoutName}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Card.Divider />
      </View>
      )}
    
    
    />
       
    //   {getPersonal?.map((specific) => (
    //     <View key={specific?.id}>
    //       <TouchableOpacity
    //         onPress={() => navigation.navigate('Specific', { name: specific.WorkoutName,WorkoutCelebId:specific.WorkoutCelebId })}
    //         className="px-5 py-4"
    //       >
    //         <View className="flex-row justify-between">
    //           <View className="flex items-center justify-center">
    //             <Text>{specific.WorkoutName}</Text>
    //           </View>
    //         </View>
    //       </TouchableOpacity>
    //       <Card.Divider />
    //     </View>
    //   ))}
  
    
    // </ScrollView>
  )
}

export default MyExerciseScreen