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
      const [status,setStatus]=useState<any>(false);
      const handlePress =async()=>
      {
        try {
          const answer=mutate({WorkoutCelebId:workoutId,workoutName:name})
          if(!isPosting){
            if (typeof answer === 'string') {
              ToastAndroid.show(answer, ToastAndroid.SHORT);
              trpc.post.getWorkoutToUser.useQuery();
            }
          }
            else {
            ToastAndroid.show('Workout added', ToastAndroid.SHORT);
          }
        }
        catch(error){
          ToastAndroid.show("Couldnt add",ToastAndroid.SHORT)
          console.error(error);

        }
      }
     const navigation = useNavigation<HeadScreenNavigationProp>();
     
  return (
//     <View className="w-[325px] h-[70px] px-3.5 py-[8.89px] bg-white rounded-[20px] shadow justify-between items-center gap-11 inline-flex">
// <View className="grow shrink basis-0 h-[61.22px] justify-between items-center gap-[11px] flex">
// <View className="w-[206.89px] flex-col justify-start items-center inline-flex">
// <Text className="self-stretch text-center text-black text-base font-light tracking-tight">Chris Bumstead Workout</Text>
// </View>
// <View className="w-[75px] h-[61.22px] flex-col justify-end items-center inline-flex">
// <View className="h-[51.66px] flex-col justify-start items-end gap-[9px] flex">
// <View className="w-[75px] h-[22.55px] relative">
// <View className="w-[75px] h-[22.55px] left-0 top-0 absolute bg-yellow-300" />
// <Text className="w-[23.86px] h-[13.20px] left-[29px] top-[5.90px] absolute text-black text-opacity-50 text-[9px] font-normal tracking-tight">Add</Text>
// </View>
// <View className="flex-col justify-start items-end gap-[9px] flex">
// <View className="w-[51.72px] h-[20.11px] py-[4.73px] bg-gray-200 rounded-[15px] flex-col justify-start items-center flex">
// <Text className="text-black text-opacity-50 text-[8px] font-medium tracking-tight">124</Text>
// </View>
// </View>
// </View>
// </View>
// </View>
// </View>
<TouchableOpacity onPress={() => navigation.navigate("MyModal", { name: name, workoutId: workoutId, ratings: ratings })}>
    <View className="h-20 m-3 bg-white rounded-[20px] shadow flex-row justify-between items-center p-4">
    <Text className="text-center text-black text-base font-light tracking-tight">
    {name}
</Text>
        <View className="flex-col items-center space-y-2"> 
            <TouchableOpacity onPress={handlePress}>
                <View className="items-center justify-center w-[75px] h-[22.55px] bg-yellow-200">
                    <Text>{status ? "added" : "add"}</Text>
                </View>
            </TouchableOpacity>
            <View className="bg-gray-300 w-10 flex items-center justify-center m-2 rounded-lg"> 
                <Text>{ratings}</Text>
            </View>
        </View>
    </View>
</TouchableOpacity>

  )
}

export default Workout_celeb