import { View, Text } from 'react-native'
import React, { useState } from 'react'


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

const ExerciseComponent = ({id,name,sets,setType}:exercises) => {
  let color;

  return ( 
    <View>
        <View className='flex-row justify-between   m-0.5'> 
        
        <Text  className='text-black text-[15px]  font-light tracking-tight'>{name}</Text> 
        {setType==="supersets"&& 
        <View  className='bg-red-200'>
           <Text>{setType}</Text>
           </View>}
        </View>
      
    </View>
  )
}

export default ExerciseComponent