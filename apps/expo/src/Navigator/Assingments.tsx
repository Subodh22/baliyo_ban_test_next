import { View, Text } from 'react-native'
import React, { useRef, useState } from 'react'
 
import Constants from "expo-constants";


import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
const Assingments = () => {
    
  
  
    return (<View> 
      <View className='flex w-[300px] h-[300px]'> 
      <Picker  style={{width:'100%', height:200}} onValueChange={()=>console.log("pic")}>
      <Picker.Item label="Java" value="java" />
      <Picker.Item label="JavaScript" value="js" />
    </Picker>
    </View>  

    <Picker   style={{width:'100%', height:200}}>
     <Picker.Item label="Java" value="java" />
     <Picker.Item label="JavaScript" value="js" />
   </Picker>
   <Picker style={{width:300, height:200}}>
     <Picker.Item label="Java" value="java" />
     <Picker.Item label="JavaScript" value="js" />
   </Picker>
       </View>
   
   )
}

export default Assingments