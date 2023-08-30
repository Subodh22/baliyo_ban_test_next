import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input } from 'react-native-elements'
import { trpc } from '../utils/trpc'
const AddSetsFromEx = (props:any) => {
   
  return (
     <ScrollView> 
   <View className='mb-2 pr-5 pl-1 h-[90px] w-full  rounded-[20px] shadow justify-between items-center  flex-row' >
    <Text className='text-black text-center text-[15px] font-light tracking-tight'> Set {props.name+1}</Text>
    <View> 
    <Text  className='text-black text-center text-[15px] font-light tracking-tight'>Reps</Text>
    <Text className='text-black text-center text-[15px] font-light tracking-tight'>{props.reps}</Text>
     
  
    </View>
    <View> 
    <Text className='text-black text-center text-[15px] font-light tracking-tight'>Weight</Text> 
    <View className='flex-row justify-center items-center  '> 
     <Text className='text-black text-center text-[15px] font-light tracking-tight'>{props.weight}</Text>
    <Text  className='text-black text-center text-[15px] font-light tracking-tight'>kg</Text>
    </View>
  </View>
    <View> 
    <Text className='text-black text-center text-[15px] font-light tracking-tight'>Rest</Text>
    <View className="flex-row "> 
    {/* <Input  onChangeText={(text)=>setNewRestTime(text)}  value={newRestTime} containerStyle={{ width: 50 }} inputContainerStyle={{ borderBottomWidth: 0 }} maxLength={3}  keyboardType="numeric" placeholder={restTime}/> */}
   
   <TouchableOpacity  className=" ">
    <Text className='text-black text-center text-[15px] font-light tracking-tight'>
    {props.restTime} min
    </Text>
   </TouchableOpacity>
    </View>
     
     </View>
     <TouchableOpacity className='w-[51.72px] h-[30px] px-3.5 py-1.5 bg-yellow-300 flex-col justify-center items-center'  onPress={()=>{ 
    props.change(props.id)
    
  }}>
      <Text className="text-black text-center text-[15px] font-light tracking-tight">Edit</Text>
     </TouchableOpacity>
    
     <TouchableOpacity 
     onPress={()=>{props.removeSet(props.id)}}
     className='h-8 w-8 bg-gray-200 justify-center items-center' >
      <Text > - </Text>
     </TouchableOpacity>
   
 </View>
 </ScrollView>
  )
}

export default AddSetsFromEx