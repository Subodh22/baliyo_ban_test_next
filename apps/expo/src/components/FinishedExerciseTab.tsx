import { View, Text } from 'react-native'
import React from 'react'
import { Button } from '@rneui/base'

const FinishedExerciseTab = (props:any) => {
  return (
    <View className='pt-10'>
      <Text>Congratulation you finished your exercise</Text>
      <Button title="Finished" onPress={()=>
        {
            props.setClosed(false)
        }}/>
    </View>
  )
}

export default FinishedExerciseTab