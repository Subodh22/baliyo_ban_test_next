import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../Navigator/TabNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigator/RootNavigator';
import { trpc } from '../utils/trpc';
import { Card } from 'react-native-elements';
export type MyExerciseNavigationProp=CompositeNavigationProp<BottomTabNavigationProp<TabParamList,"MyExercise">,
NativeStackNavigationProp<RootStackParamList>>;


type PlanScreenRouteProp = RouteProp<RootStackParamList, "PlanScreenT">;
const PlanScreen = () => {
    
    const navigation = useNavigation<MyExerciseNavigationProp>()
    useLayoutEffect(()=>{
        navigation.setOptions({
          headerTitle:name
        })
    
      },[])
    const { params: { WorkoutCelebId: workoutCelebId, name  } } = useRoute<PlanScreenRouteProp>()
    const {data,isLoading} = trpc.post.getPersonal.useQuery({
        workoutId:workoutCelebId
    })
    if(!isLoading)
    {
        console.log(data?.plan)
    }
    const notUnlocked=()=>
    {
        console.log("finish first")
    }
  return (
    
    <FlatList 
    
      data = {data?.plan}
      keyExtractor={(item)=>`${item.id}`}
      
      renderItem={({item})=>(<> 
         <View >
           
        <TouchableOpacity
          onPress={() => {data!.getPeronalPlan!.currentWeek>=item.order?  navigation.navigate('Specific', { name: name,WorkoutCelebId:workoutCelebId,planId:item.id,currentStatus:data!.getPeronalPlan!.currentStatus,currentWeek:data!.getPeronalPlan!.currentWeek,id:data!.getPeronalPlan!.id,planLength:(data!.plan).length,orderP:item.order}):notUnlocked()}}
           
          className="px-5 py-4"
        >
          <View className="flex-row justify-between">
            <View className="flex-row items-center justify-between w-full">

              <Text className='text-black text-[18px]  font-light tracking-tight'>{item.planName} </Text>
              {data!.getPeronalPlan!.currentWeek>item.order?
              <Text className='text-black text-[18px]  font-light tracking-tight'>Done </Text>
            :data!.getPeronalPlan!.currentWeek==item.order?  <Text className='text-black text-[18px]  font-light tracking-tight'>Current</Text>
            :<></>
            }
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

export default PlanScreen