import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import CameraComponent from './CameraComponent'

const DoneForInsidePage = (props:any) => {
    const [cameraShow,setCameraShow] = useState(false)
     
  return (
    <View>
      <Text>Take a progress pic </Text>
      <Modal visible={cameraShow}>
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
           setCameraShow((prev:boolean)=>!prev)
        }}> 
      <Text className='bg-yellow-300 h-[50px] w-[100px] '>Gp back</Text></TouchableOpacity>
        <CameraComponent topicId={props.topicId} setImageUrls={props.setImageUrls} setCameraShow={setCameraShow}  />
      </Modal>
      <TouchableOpacity onPress={()=>
        {
            setCameraShow(prev=>(!prev))
        }}>
    <Text>Camera</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DoneForInsidePage