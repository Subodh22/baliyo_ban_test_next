import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements'
import { trpc } from '../utils/trpc';

const Session = (props:any) => {
  
  const ChangeSession=()=>{
    props.changeSession(true)
    props.addSess()
    console.log("hittinh")
   
  }
  return (

    <View className='pt-20'>
     <Text>Starting a session with  </Text>
     <Button title="Start"  onPress={ChangeSession}/>  
    </View>
  )
}

export default Session