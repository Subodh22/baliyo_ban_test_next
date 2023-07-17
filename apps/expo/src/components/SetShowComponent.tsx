import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'react-native-elements'


type set = {
  exerciseId:number,
  id:number,
  name:string,
  order:number,
  restTime:string,
  type:string,
  volume:string,
  weight:string
}
type exercises={
  id: number;
name: string;

setType: string|null;
order: number;

sets:set[];
}

const SetShowComponent = ({id,name,setType,order,sets}:exercises) => {
 
  return (
    <View>
     {sets.map(({id,name,order,restTime,type,volume,weight})=>(
     
     <View key={id}  className='bg-gray-200 flex-row justify-between align-center space-between'>
         <Text>{name}</Text>
         <View> 
         <Text className=''>reps</Text>
         <Text>{volume}</Text></View>
         <View> 
         <Text>Weight</Text>
         <Text>{weight}</Text></View>
         <View> 
         <Text>rest</Text>
         <Text>{restTime}</Text></View>
         <Button title="Done"/>
        
      </View>))  }
      
    </View>
  )
}

export default SetShowComponent