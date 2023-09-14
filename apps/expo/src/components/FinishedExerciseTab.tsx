import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Button } from '@rneui/base'
import { trpc } from '../utils/trpc'
import { SafeAreaView } from 'react-native-safe-area-context'

const FinishedExerciseTab = (props:any) => {
    const finishedExercise = trpc.post.finishSession.useMutation();
    const changeProgress = trpc.post.changeDayProgress.useMutation();
    const finishWeek = trpc.post
    const finishWork=()=>{
      props.setClosed(false)
            finishedExercise.mutate({
                sessiodId:props.sessionId

            })

      let Cweek=props.currentWeek
      let CStatus=props.currentStatus
      if(props.currentWeek<props.planLength)
      {
         
        if(props.currentStatus<props.currentWeekLength-1)
        {
          CStatus+=1
        }else{
          CStatus=0
          Cweek +=1
        }

      }else{
        if(props.currentStatus<props.currentWeekLength)
        {
          CStatus+=1
        }else{
          console.log("Finished EVERYTHING")
        }
      }

       changeProgress.mutate({
        pPId:props.pPId,
        currentStatus:CStatus,
        currentWeek: Cweek

       })
    }
  return (
    <SafeAreaView className=' m-2 flex-1 justify-center'>
      <Text className='text-black text-[20px]  font-light tracking-tight'>Congratulation, you finished your exercise</Text>
      <TouchableOpacity className='h-[60px] mt-2 bg-yellow-300  justify-center items-center flex'  onPress={()=>
        {
           finishWork()
        }}>
  <Text className='text-black text-[15px]  font-light tracking-tight'>Next</Text>
</TouchableOpacity>
     
    </SafeAreaView>
  )
}

export default FinishedExerciseTab