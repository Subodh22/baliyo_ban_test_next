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
    <TouchableOpacity onPress={()=>navigation.navigate("MyModal",{name:name,workoutId:workoutId,ratings:ratings})} >
        <Card  > 
            <View className='flex-row justify-between'> 
             <View className='flex items-center justify-center'>
                <Text >{name}
                
                </Text></View> 
             <View className='flex-column items-center'> 
                <TouchableOpacity   onPress={handlePress} className={`items-center justify-center w-20 h-10   rounded-lg  -500 el`+status?`bg-blue-400`:`bg-red-100` }>
                    <Text>{status?"added":"add"}</Text>
                </TouchableOpacity>
                <View className='bg-gray-300 w-10 flex items-center m-2 '> 
                <Text>{ratings}</Text></View>
                </View>
            </View> 
      </Card>
    
    </TouchableOpacity>
  )
}

export default Workout_celeb