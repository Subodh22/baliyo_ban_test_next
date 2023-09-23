import { View, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import YoutubeEm from '../components/YoutubeEm'
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './RootNavigator';
import { TimePicker } from 'react-native-simple-time-picker';
 
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
const Assingments = () => {
    type SpecificScreenRouteProp = RouteProp<RootStackParamList, "Assignments">;
    const { params: {videoId:videoId} } = useRoute<SpecificScreenRouteProp>();
    const [date, setDate] = useState(new Date(1598051730000));
    const [value,setValue] = useState(
      { hours: 1,
        minutes: 0,
        seconds: 0,}
    )
  
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