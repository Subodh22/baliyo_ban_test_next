import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CameraComponent from '../components/CameraComponent'

const Picture = (props:any) => {
  return (
    <> 
    <TouchableOpacity className='h-[40px] w-[100px] justify-center  bg-yellow-300' onPress={()=>
        {
         props.setCameraShow((prev:boolean)=>!prev)
        }}> 
      <Text>Add photos</Text></TouchableOpacity>
<Modal    visible={props.cameraShow} animationType='slide'>
 <SafeAreaView style={{ flex: 1 }}>
 <TouchableOpacity  style={{ 
             position: 'absolute',
             zIndex: 10, // Bring the button to the front
             top: 40,
            left: 0, 
             
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: 10, }} onPress={()=>
        {
           props.setCameraShow((prev:boolean)=>!prev)
        }}> 
      <Text className='bg-yellow-300 h-[50px] w-[100px] '>Gp back</Text></TouchableOpacity>
  <CameraComponent topicId={`challenges/${props.topicId}`} setCameraShow={props.setCameraShow} setImageUrls={props.setImageUrls}/>
  </SafeAreaView> 
</Modal>
 
      
      </>
  )
}

export default Picture