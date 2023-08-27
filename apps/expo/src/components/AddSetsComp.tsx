import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Picker} from '@react-native-picker/picker';
import { Button } from '@rneui/base';
const AddSetsComp = (props:any) => {
    const [selectedValue,setSelectedValue] = useState("1");
    const [selectedWeight,setSelectedWeight] = useState("1");
    const generateSetId =  Date.now() + Math.floor(Math.random() * 1000000);

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
    <View className='flex pt-10 '>
        <Text>Exercise : {props.name}</Text>
        <Text>Set : Set {props.setName +1} </Text>
        
        <View> 
            <Text>Reps : </Text>
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
      <Text>Weight : (kg)</Text>
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
      <Button title="Save Set" onPress={()=>{props.addSets('add')}} />
    </View>
  )
}

export default AddSetsComp