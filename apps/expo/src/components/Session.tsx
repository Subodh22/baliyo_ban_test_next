import { View, Text, TouchableOpacity } from 'react-native'
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
<View> 
    <View className='pt-20 mx-2 flex-row item-center '>
     <View> 
     <Text className='text-black text-center text-[20px] font-light tracking-tight'>
      Start a session  </Text></View>
      {/* <View className=' w-fit bg-yellow-300 flex-col justify-center items-center inline-flex'> 
      <Text className='text-black text-center text-[20px] font-light tracking-tight'>{props.ex}</Text>
      </View> */}
    </View>
    <TouchableOpacity className='my-16 mx-2 h-[40px] w-fit bg-yellow-300 flex-col justify-center items-center inline-flex' onPress={ChangeSession}>
      <Text className='text-black text-center text-[20px] font-light tracking-tight'>Begin</Text>
    </TouchableOpacity>
 
     </View>
  )
}

export default Session