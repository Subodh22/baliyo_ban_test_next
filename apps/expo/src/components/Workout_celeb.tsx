import { View, Text, Pressable, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { HeadScreenNavigationProp } from '../screens/HeadScreen';
import {Button} from 'react-native-elements';
import { Card } from '@rneui/base';
import { trpc } from '../utils/trpc';
 type props ={
    workoutId : number;
    name : string;
    ratings:string;
 }
const Workout_celeb = ({workoutId,name,ratings}:props) => {
      const {mutate,isLoading:isPosting} = trpc.post.addWorkoutToUser.useMutation();
      trpc.post.getWorkoutData.useQuery({workoutId:workoutId});
      const [ref,setRef]=useState(false)
      const refresh = trpc.post.getWorkoutToUser.useQuery({workerI:"fill"},{enabled:false});
      const [status,setStatus]=useState<any>(false);
      const handlePress =async()=>
      {
        // refresh.refetch()
        const answer=mutate({WorkoutCelebId:workoutId,workoutName:name},{onSuccess:()=>
        {
          refresh.refetch()
          setStatus(true)
        }}
        ) 
       
      }
     const navigation = useNavigation<HeadScreenNavigationProp>();
     
  return (
  
<TouchableOpacity onPress={() => navigation.navigate("MyModal", { name: name, workoutId: workoutId, ratings: ratings })}>
    <View className="h-24 m-3 bg-white  shadow flex-row justify-between items-center p-4">
    <Text className="text-black text-[20px]  font-light tracking-tight">
    {name}
</Text>
        <View className="flex-col items-center gap-1"> 
            <TouchableOpacity onPress={handlePress}>
                <View className="items-center justify-center w-[75px] h-[35px] bg-yellow-300">
                    <Text className="text-black   font-light tracking-tight">{status ? "added" : "add"}</Text>
                </View>
            </TouchableOpacity>
            <View className="bg-gray-300 w-10 p-1 flex items-center justify-center "> 
                <Text className="text-black text-[12px]  font-light tracking-tight">{ratings}*</Text>
            </View>
        </View>
    </View>
</TouchableOpacity>

  )
}

export default Workout_celeb