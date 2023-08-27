import { View, Text } from 'react-native'
import React from 'react'
import { Button } from '@rneui/base'
import { trpc } from '../utils/trpc'

const FinishedExerciseTab = (props:any) => {
    const finishedExercise = trpc.post.finishSession.useMutation();
  return (
    <View className='pt-10'>
      <Text>Congratulation you finished your exercise</Text>
      <Button title="Finished" onPress={()=>
        {
            props.setClosed(false)
            finishedExercise.mutate({
                sessiodId:props.sessionId
            })
        }}/>
    </View>
  )
}

export default FinishedExerciseTab