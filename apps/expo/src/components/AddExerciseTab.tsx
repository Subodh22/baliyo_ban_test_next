import { View, Text, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input } from '@rneui/base'
import AddSetsFromEx from './AddSetsFromExercise'
import AddSetsComp from './AddSetsComp';
import SetsPicker from './SetsPicker';

type set = {
    id:number,
    name:string,
    weight:string,
    reps:string,
    restTime:string


}[];

const AddExerciseTab = (props:any) => {
   const [changeValue,setChangeValue] = useState<boolean>(false) 
    const [sets,setSets] = useState<set>([])
    const [reps,setReps] = useState("1")
    const [weight,setWeight] = useState("1")
    const [activeId,setActiveId]=useState(0)
    useEffect(()=>{
        setSets((prev)=>[
            ...prev, {id:0,
                name:"Set 1",
                weight:"20",
                reps:"30",
                restTime:"2.00"
            }
        ])
    },[])
    const [exerciseName,setExerciseName] = useState("")
    const addSets=()=>{
        console.log("Hello"+sets.length)
        setSets((prev)=>
            [...prev,
            {id:sets.length+1,
                name: "Set "+ (sets.length+1) ,
                weight:"20",
                reps:"30",
                restTime:"2.00"
            }]
        )
    }
    const changeSetDetails=(id:number)=>
    {
        const newSetDets = sets.map((set)=>{
            console.log(reps)
            console.log(weight)
            if (set.id === id) {
                return {
                    ...set,
                    reps: reps,
                    weight: weight
                };
            }
            return set; 

        })
        setSets(newSetDets);
        setChangeValue(false);
    }
    const changeValuefunc=(id:number)=>{
        setChangeValue(true)
        setActiveId(id)
    }
    const removeSet = (id: number) => {
        setSets(prevSets => prevSets.filter(set => set.id !== id));
    };
  return (<> 
    <Modal visible={changeValue}>
    <SetsPicker change={changeSetDetails} 
    id={activeId}
    setWeight={setWeight}
    setReps={setReps}

    />
    </Modal>

    <View className='pt-10'>
   <TouchableOpacity  className='h-10 w-20 bg-slate-400 justify-between content-center'
   onPress={()=>{props.goBack(false)}} >
    <Text>Go back</Text>
   </TouchableOpacity>
      <Text>add Exercise</Text>
      
      <TextInput 
       className='h-10  text-xl bg-gray-500'
      
       onChangeText={(text)=>{
        setExerciseName(text)
       }}
       placeholder="Enter Exercise name"/>

<Text>{exerciseName?"Name : " + exerciseName:"Enter your exercise name"}</Text>
         <FlatList
         data={sets}
         keyExtractor={(item)=>`${item.id}`}
         renderItem={({item,index})=>(
            <AddSetsFromEx key={item.id} 
            name={index}
            reps={item.reps}
            id={item.id}
            weight={item.weight}
            restTime={item.restTime}
            removeSet={removeSet}
            change= {changeValuefunc}
            />
         )}
         />
          <Button  title="addsets" onPress={addSets}/>
         <Button  title="addExercises"/>
   
    </View>
    </>
  )
}

export default AddExerciseTab