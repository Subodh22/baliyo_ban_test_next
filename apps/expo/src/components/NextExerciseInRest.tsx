import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Picker} from '@react-native-picker/picker';
import { Button } from 'react-native-elements';
import PickerChangerForRest from './PickerChangerForRest';

const NextExerciseInRest = (props:any) => {
    const [selectedValue,setSelectedValue] = useState("1");
    const [selectedWeight,setSelectedWeight] = useState("1");
    const [awakeEdit,setAwakeEdit] = useState(false)
  
    useEffect(()=>{
        setSelectedValue(props.reps)
        setSelectedWeight(props.Weight)
        props.newRepsSet(props.reps)
        props.newWeight(props.Weight)
    },[])
  return (
   
    <View className='flex  flex-col '>
       <Modal visible={awakeEdit}>
          <PickerChangerForRest selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          newRepsSet={props.newRepsSet}
          ChangedValue={props.ChangedValue}
          setSelectedWeight={setSelectedWeight}
          selectedWeight={selectedWeight}
          changedEdit={props.changedEdit}
          newWeight={props.newWeight}
          setAwakeEdit={setAwakeEdit}
          updatedExe={props.updatedExe}
          />
        </Modal>
       
        <View className=' h-[40px]   bg-yellow-300  justify-center items-center flex'> 
        <Text className='text-black text-[15px]  font-light tracking-tight'> {props.name}</Text>
        </View>
        <Text className='text-black text-[15px] mt-1 font-light tracking-tight'>Set : {props.setName}</Text>
         
        <View  className='flex-row'>
  <Text className='text-black text-[15px]  font-light tracking-tight'>
   Do : {selectedValue } reps of </Text>
  <Text className='text-black text-[15px]  font-light tracking-tight'>
  {selectedWeight} kg</Text>
</View>
<View className='flex-row gap-2 mt-1'> 
<TouchableOpacity className='h-[40px] w-[70px] mt-2 bg-yellow-300  justify-center items-center flex' onPress={()=>{
   
  setAwakeEdit(true)}}>
  <Text className='text-black text-[15px]  font-light tracking-tight' >edit</Text>
</TouchableOpacity>
<TouchableOpacity className='h-[40px] w-[70px] mt-2 bg-yellow-300  justify-center items-center flex' onPress={()=>{
  props.setDuration(
    ((prev: number) => prev+30)
  )
}}>
  <Text className='text-black text-[15px]  font-light tracking-tight' >+ 30sec</Text>
</TouchableOpacity>
   
</View>
        
    </View>
  )
}

export default NextExerciseInRest