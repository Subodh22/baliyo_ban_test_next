import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input } from 'react-native-elements'
import { trpc } from '../utils/trpc'
const AddSetsFromEx = (props:any) => {
   
  return (
     
   <View className='flex flex-row justify-between' >
    <Text > Set {props.name+1}</Text>
    <View> 
    <Text className=''>reps</Text>
    <Text className=''>{props.reps}</Text>
     
  
    </View>
    <View> 
    <Text>Weight</Text> 
    <View className='flex-row justify-center items-center  '> 
     <Text>{props.weight}</Text>
    <Text >kg</Text>
    </View>
  </View>
    <View> 
    <Text>rest</Text>
    <View className="flex-row "> 
    {/* <Input  onChangeText={(text)=>setNewRestTime(text)}  value={newRestTime} containerStyle={{ width: 50 }} inputContainerStyle={{ borderBottomWidth: 0 }} maxLength={3}  keyboardType="numeric" placeholder={restTime}/> */}
   
   <TouchableOpacity  className="w-20 h-10 bg-blue-300">
    <Text>
    {props.restTime}
    </Text>
   </TouchableOpacity>
    </View>
     
     </View>
     
    <Button  onPress={()=>{console.log("chaging");
    props.change(props.id)
    
  }}
    title="Edit"/>
     <TouchableOpacity 
     onPress={()=>{props.removeSet(props.id)}}
     className='h-10 w-10 bg-white justify-center ' >
      <Text> - </Text>
     </TouchableOpacity>
   
 </View>
    
  )
}

export default AddSetsFromEx