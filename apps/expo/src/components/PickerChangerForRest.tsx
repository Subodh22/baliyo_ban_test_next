import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Picker} from '@react-native-picker/picker';
import { Button } from '@rneui/base';
import { SafeAreaView } from 'react-native-safe-area-context';
const PickerChangerForRest = (props:any) => {
    const generateOptions = () => {
        const options = [];
        for (let i = 0.25; i <= 200; i += 0.25) {
          options.push(
            <Picker.Item key={i} label={i.toString()} value={i.toString()} />
          );
        }
        return options;
      };
  return (
    <SafeAreaView className="flex-column justify-start pt-10 h-full m-2">
      <View> 
        <View className='h-[40px]  my-4 bg-yellow-300  justify-center items-center flex'> 
      <Text className='text-black text-[20px]  font-light tracking-tight'>Edit the set </Text>
      </View>
            <Text className='text-black text-[15px]  font-light tracking-tight'>Reps : </Text>
       <Picker className='w-20'
        selectedValue={props.selectedValue}
        
        onValueChange={(itemValue, itemIndex) =>{
             props.setSelectedValue(itemValue)
             props.newRepsSet(itemValue)
             props.ChangedValue(true)
            }
    }
      >
        <Picker.Item label="to failure" value="Failure" />
        {[...Array(40)].map((_, i) => (
          <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
        ))}
          
      </Picker>
      <Text  className='text-black text-[15px]  font-light tracking-tight'>Weight : (kg)</Text>
      <Picker className='w-100'
        selectedValue={props.selectedWeight}
  
        onValueChange={(itemValue) => {
            props.setSelectedWeight(itemValue.toString())
            props.newWeight(itemValue.toString())
            props.ChangedValue(true)
          }}
      >
         <Picker.Item label="Bodyweight" value="BodyWeight" />
        {generateOptions()}
      </Picker>
      </View>
      <TouchableOpacity  className='h-[40px]  my-4 bg-yellow-300  justify-center items-center flex' onPress={()=>{props.changedEdit(false)
        props.setAwakeEdit(false)
    }}>
        <Text  className='text-black text-[20px]  font-light tracking-tight'>Save</Text>
      </TouchableOpacity>
       
    </SafeAreaView>
  )
}

export default PickerChangerForRest