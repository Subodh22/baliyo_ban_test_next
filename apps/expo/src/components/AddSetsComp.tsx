import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Picker} from '@react-native-picker/picker';
import { Button } from '@rneui/base';
const AddSetsComp = (props:any) => {
    const [selectedValue,setSelectedValue] = useState("1");
    const [selectedWeight,setSelectedWeight] = useState("1");
    const generateSetId = Math.floor(Math.random() * 100000);
    console.log(Date.now())
    const generateOptions = () => {
        const options = [];
        for (let i = 0.25; i <= 200; i += 0.25) {
          options.push(
            <Picker.Item key={i} label={i.toString()} value={i.toString()} />
          );
        }
        return options;
      };
      useEffect(()=>{
        setSelectedValue(props.reps)
        setSelectedWeight(props.Weight)
        props.newRepsSet(props.reps)
        props.newWeight(props.Weight)
    },[])
  return (
    <View className='flex pt-16   '>
     {props.setAddsetTab && <TouchableOpacity className=" w-[100px] h-[40px] mx-2 p-2.5 bg-yellow-300 flex-col justify-center items-center inline-flex"
  onPress={()=>{
   props.setAddsetTab(false);
    props.setNewReps("")
    props.setNewWeight("")
    
  }

}
  >
    <Text className="text-black text-center text-[15px] font-light tracking-tight">
      Go back
    </Text>
  </TouchableOpacity>}
    <View className="h-[40px] w-[200px] p-2.5 m-3 bg-yellow-300 justify-center items-center flex">
      <Text  className='text-black text-[15px] font-light   tracking-tight'> {props.name}</Text>
      </View>
         <View className='m-3 mt-1'>
         <Text className='text-black text-[15px] font-light tracking-tight'>Set {props.setName +1} </Text>
       
         </View>
         
        <View className='m-3 mt-1'> 
            <Text className='text-black text-[15px] font-light tracking-tight'>Reps : </Text>
        <Picker className='w-20'
        selectedValue={selectedValue}
        
        onValueChange={(itemValue, itemIndex) =>{
             setSelectedValue(itemValue)
             props.newRepsSet(itemValue)
            
            }
    }
      >
        <Picker.Item label="to failure" value="Failure" />
        {[...Array(40)].map((_, i) => (
          <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
        ))}
          
      </Picker>
      <View className=''>
         <Text className='text-black text-[15px] font-light tracking-tight'>Weight : (kg) </Text>
       </View>
      <Picker className='w-100'
        selectedValue={selectedWeight}
  
        onValueChange={(itemValue) => {
            setSelectedWeight(itemValue.toString())
            props.newWeight(itemValue.toString())
        }}
      >
         <Picker.Item label="Bodyweight" value="BodyWeight" />
        {generateOptions()}
      </Picker>
      </View>
      <TouchableOpacity onPress={()=>{props.addSets('add')}} className=" w-fill h-[40px] mx-2 p-2.5 bg-yellow-300 flex-col justify-center items-center inline-flex">
      <Text className="text-black text-center text-[15px] font-light tracking-tight">
      Add Set
    </Text>
      </TouchableOpacity>
      
    </View>
  )
}

export default AddSetsComp