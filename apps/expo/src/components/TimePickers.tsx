import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker';
const TimePickers = (props:any) => {
  const [val,setVal] = useState(
    { hours: '01',
      minutes: '00',
      }
  )
  return (
    <View className='flex-row'>
   
    
     <Picker  style={{width:'50%', height:200}}
    selectedValue={val.hours}
        onValueChange={(itemValue:string, itemIndex) =>{
        
             props.setValue((prev:any)=>({
              ...prev,
              hours:parseInt(itemValue)
             }))
             setVal((prev:any)=>({
              ...prev,
              hours:itemValue
             }))

            }
    }
      >
        
        {[...Array(10)].map((_, i) => (
        <Picker.Item key={i} label={`${(i ).toString().padStart(2, '0')}`} value={`${(i ).toString().padStart(2, '0')}`} />
        ))}
     </Picker>
     <Picker  style={{width:'50%', height:200}}
    selectedValue={val.minutes}
        onValueChange={(itemValue:string, itemIndex) =>{
        
          props.setValue((prev:any)=>({
            ...prev,
            minutes:parseInt(itemValue)
           }))
           setVal((prev:any)=>({
            ...prev,
            minutes:itemValue
           }))
            }
    }
      >
     
        {[...Array(61)].map((_, i) => (
          <Picker.Item key={i} label={`${(i).toString().padStart(2, '0')}`} value={`${(i ).toString().padStart(2, '0')}`} />
        ))}
     </Picker>
    </View>
  )
}

export default TimePickers