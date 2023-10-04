import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Card, Input } from '@rneui/base'
import AddSetsFromEx from './AddSetsFromExercise'
import AddSetsComp from './AddSetsComp';
import SetsPicker from './SetsPicker';
import { trpc } from '../utils/trpc';
import Workout_celeb from './Workout_celeb';

type set = {
    id:number,
    name:string,
    weight:string,
    reps:string,
    restTime:string
   
}[];
type PersonalExercise = {
  id :number,
  name:string    
  type:string
  setType:string
  order:number          
  routineId:number       
  videoId:string          
  machineSettings:string 
  workoutCelebId:number  
}

const AddExerciseTab = (props:any) => {
   const [changeValue,setChangeValue] = useState<boolean>(false) 
    const [sets,setSets] = useState<set>([])
    const [reps,setReps] = useState("1")
    const [weight,setWeight] = useState("1")
    const [activeId,setActiveId]=useState(0)
    const [exerciseName,setExerciseName] = useState("")
    const [actualex,setActualex] = useState<PersonalExercise>()
   const addExerciseToDb=trpc.post.addPersonalExercise.useMutation()
    const [shouldFetch, setShouldFetch] = useState(false);
    const addPersonalSets = trpc.post.createPersonalSets.useMutation()
    useEffect(() => {
      if (exerciseName.length > 3) {
        setShouldFetch(true);
      } else {
        setShouldFetch(false);
      }
    }, [exerciseName]);
  
    const response = trpc.post.searchExerciseByName.useQuery(
      { exerciseName: exerciseName },
      { enabled: shouldFetch }  // This conditionally fires the query
    );
  
    const { data: exercises } = response || { data: null };
    useEffect(()=>{
        setSets((prev)=>[
            ...prev, {id:0,
                name:"Set 1",
                weight:"20",
                reps:"30",
                restTime:"2.00",
                // exerciseId:0,
                // personId:"fill",
                // workoutCelebId:0,
                // order:0,

            }
        ])
    },[])
      const addSets=()=>{
        console.log("Hello"+sets.length)
        setSets((prev)=>
            [...prev,
            {id:sets.length+ Math.floor(Math.random() * 100),
                name: "Set "+ (sets.length+1) ,
                weight:"20",
                reps:"30",
                restTime:"2.00",
                // exerciseId:exercises[0]?.id,
                // workoutCelebId:exercises[0]?.routineId
            }]
        )
    }
    const addExerciseToTables=()=>
    {if(exerciseName!==""){
       
      const generateSetId =   Math.floor(Math.random() * 100000);
      console.log(Date.now())
     const id =addExerciseToDb.mutate({
      exerciseName:(actualex && actualex.name!=="")? actualex!.name : exerciseName,
      machineSettings:(actualex && actualex.name!=="")? actualex!.machineSettings : "#",
      type:(actualex && actualex.name!=="")? actualex!.type : "reps",
      setType: " ",
      exerciseToSet:generateSetId,
      routineId:props.routineId,
      videoId:(actualex && actualex.name!=="")? actualex!.videoId : "#",
      workoutCelebId:props.workoutcelebId,
      order:props.size,
      idTofill:"fill"
     },{onSuccess:(data)=>
     {  
      sets.forEach((set,index)=>
      {   
        
        addPersonalSets.mutate({
          name:set.name,
          personId:"fill",
          SetId:generateSetId+index,
          exerciseId:data,
          order:index,
          RestTime:"120",
          type:(actualex && actualex.name!=="")? actualex!.type : "reps",
          reps:set.reps,
          weight:set.weight,
          workoutCelebId:props.workoutcelebId,
          RestType:"s",
          routineId:props.routineId
        })
      })
       
      props.setExercise((prev:any) => {

        // Extract new sets
        const newSets = sets.map((set, index) => ({
          done: false,
          exerciseId: data, // Assuming data is the current exercise id
          id: generateSetId+index, // Assuming generateSetId is a function that provides a unique ID
          name: `Set ${index + 1}`,
          order: index,
          restTime: "120",
          routineId: props.routineId,
          type: (actualex && actualex.name !== "") ? actualex.type : "reps",
          volume: set.reps, // This assumes that 'reps' in your 'sets' is equivalent to 'volume'
          weight: set.weight
        }));
    
        // Construct the new exercise
        const newExerciseObject = {
          id: data,
          name: (actualex && actualex.name !== "") ? actualex.name : exerciseName,
          machineSettings: (actualex && actualex.name !== "") ? actualex.machineSettings : "#",
          type: (actualex && actualex.name !== "") ? actualex.type : "reps",
          setType: " ",
          routineId: props.routineId,
          videoId: (actualex && actualex.name !== "") ? actualex.videoId : "#",
        
          order: props.size,
          sets: newSets
        };
        console.log(newExerciseObject)
        return [...prev, newExerciseObject];
        // return {
        //   ...prev,
        //   [props.size]: newExerciseObject
        // };
      });
      props.goBack(false)

    }
    }
    
    )
    
   
 
 
    }else {
  Alert.alert("Type the exercise name")
}
    }
    const changeSetDetails=(id:number)=>
    {
        const newSetDets = sets.map((set)=>{
            
            if (set.id === id) {
                return {
                    ...set,
                    reps: reps,
                    weight: weight,

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

    <View className='flex pt-16 '>
   <TouchableOpacity  className=" w-[100px] h-[40px] mx-2 p-2.5 bg-yellow-300 flex-col justify-center items-center inline-flex"
   onPress={()=>{props.goBack(false)}} >
    <Text className='text-black text-center text-[15px] font-light tracking-tight'>Go back</Text>
   </TouchableOpacity>
     
      <View className='pt-5 mx-3'>

      <TextInput 
       className='w-full h-[47px] px-3 bg-gray-100  font-light tracking-tight'
      
       onChangeText={(text)=>{
        setExerciseName(text)
        setActualex(
          {id:0,
            name:"",
            machineSettings:"0",
            type:"",
            setType:"",
            routineId:0,
            videoId:"",
            workoutCelebId:0,
            order:0

          }
        )
        
       }}
       placeholder="Enter Exercise name"/>

      </View>
       
<View className='p-4'><Text className="text-black text-[15px] font-light tracking-tight">{actualex ?"Name : " + actualex.name:"Name : " +exerciseName}</Text>
</View>

{exercises&&actualex?.name=="" && (
        <View className='m-3'> 
        <FlatList
          data={exercises.slice(0,5)}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
          
          // <View className='h-[40px]    w-full bg-stone-200 flex-col justify-start items-start flex'> 
            <TouchableOpacity className='h-[40px]    w-full bg-stone-200 flex-col justify-start items-start flex' onPress={()=>{setActualex(
                    {id:0,
                      name:item.name,
                      machineSettings:item.machineSettings,
                      type:item.type,
                      setType:"",
                      routineId:props.routineId,
                      videoId:item.videoId,
                      workoutCelebId:props.workoutCelebId,
                      order:props.size

                    })
                }}
                 >
                 <Text className=' ml-1 p-2 text-black text-base font-light tracking-tight text-center' >{item.name}</Text>
                
            </TouchableOpacity>
              
            //  </View>
             
              
          )}
        /></View>
      )}

            <View className='m-3 bg-gray-200  flex-col justify-start items-start  inline-flex'>
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
         <TouchableOpacity onPress={addSets} className=" w-full h-[40px]  bg-yellow-300 flex-col justify-center items-center inline-flex">
          <Text className='"text-black text-center text-[15px] font-light tracking-tight'>Add Sets</Text>
         </TouchableOpacity>
          
            </View>
    
           <TouchableOpacity onPress={addExerciseToTables} className=" w-full h-[50px]   bg-yellow-300 flex-col justify-center items-center flex">
            <Text className='"text-black text-center text-[15px] font-light tracking-tight'>Add Exercises</Text>
           </TouchableOpacity>
        
   
    </View>
    </>
  )
}

export default AddExerciseTab