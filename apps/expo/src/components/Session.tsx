import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements'

const Session = (props:any) => {
  const ChangeSession=()=>{
    props.changeSession(true)
  }
  return (

    <View className='pt-20'>
     <Text>Starting a session with  </Text>
     <Button title="Start"  onPress={ChangeSession}/>  
    </View>
  )
}

export default Session