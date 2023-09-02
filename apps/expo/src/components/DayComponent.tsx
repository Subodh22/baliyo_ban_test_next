import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SetShowComponent from './SetShowComponent';
import ExerciseComponent from './ExerciseComponent';
import { useNavigation, useRoute } from '@react-navigation/native';


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
type: string;
setType: string|null;
order: number;
routineId: number;
sets:set[];
}
type props={
    id:number,
    weekRoutine:string,
    exercises:exercises[],
    order:number

}

const DayComponent = ({id,weekRoutine,exercises,order}:props) => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [expanded, setExpanded] = useState(false);
  
    const route = useRoute();
    const cRoute = route.name;
    

    const uniqueArray: exercises[] = exercises.filter((obj, index, self) =>
    index === self.findIndex((item) => item.name === obj.name)
  );
  
    
    const toggleAccordion = () => {
      setExpanded(!expanded);
      console.log(expanded)
    };
  return (
    <View>
    <View className='px-2  m-2 bg-gray-200  flex justify-center item-center' >
         <TouchableOpacity onPress={toggleAccordion} className='flex-row justify-between h-10 items-center '> 
        <View className='flex-row  '> 
        <Text  className='text-black text-[15px]  font-light tracking-tight'>{weekdays[order]} : </Text> 
        <Text  className='text-black text-[15px]  font-light tracking-tight'>{weekRoutine}</Text>
        </View>
        <View >
           <Text>+</Text>
           </View>
          
           </TouchableOpacity>
       {expanded && cRoute === "MyModal"?<View>
          {uniqueArray.map(({id,name,sets,order,setType})=>(
            <ExerciseComponent key={id}  id={id}name={name} sets={sets} order={order} setType={setType} />
          ))}
        </View>
        :expanded && cRoute === "Specific"?<View>
          
          {exercises.map(({id,name,sets,order,setType})=>(
            <View> 
              <Text >{name}</Text>
            <SetShowComponent key={id}  id={id}name={name} sets={sets} order={order} setType={setType} />
            </View>
          ))}
        </View>:null

        }
           
    </View>
    </View>
  )
}

export default DayComponent