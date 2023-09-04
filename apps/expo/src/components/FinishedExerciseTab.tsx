import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Button } from '@rneui/base'
import { trpc } from '../utils/trpc'
import { SafeAreaView } from 'react-native-safe-area-context'

const FinishedExerciseTab = (props:any) => {
    const finishedExercise = trpc.post.finishSession.useMutation();
  return (
    <SafeAreaView className=' m-2 flex-1 justify-center'>
      <Text className='text-black text-[20px]  font-light tracking-tight'>Congratulation, you finished your exercise</Text>
      <TouchableOpacity className='h-[60px] mt-2 bg-yellow-300  justify-center items-center flex'  onPress={()=>
        {
            props.setClosed(false)
            finishedExercise.mutate({
                sessiodId:props.sessionId
            })
        }}>
  <Text className='text-black text-[15px]  font-light tracking-tight'>Next</Text>
</TouchableOpacity>
     
    </SafeAreaView>
  )
}

export default FinishedExerciseTab