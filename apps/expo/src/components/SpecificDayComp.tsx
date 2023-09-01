import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Input } from 'react-native-elements'
import { trpc } from '../utils/trpc'
 
type set = {
  exerciseId:number,
  id:number,
  name:string,
  order:number,
  restTime:string,
  type:string,
  volume:string,
  weight:string,
  key:string,
  workoutCelebId:number,
  videoId:string,
  machineSettings:string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  currentSet:Function,
  // eslint-disable-next-line @typescript-eslint/ban-types
  currentExerciseIndex:Function,
  // eslint-disable-next-line @typescript-eslint/ban-types
  valSender:Function,
  // eslint-disable-next-line @typescript-eslint/ban-types
  valTimeSender:Function,
  exoOrder:number,
  done:boolean,
  startSess:boolean,
  // eslint-disable-next-line @typescript-eslint/ban-types
  removeSet:Function,
  routineId:number
  
}
 
 


const SpecificDayComp = React.memo(({id,startSess,routineId,exerciseId,removeSet,valTimeSender,name,order,done,currentSet,exoOrder,currentExerciseIndex,valSender,restTime,type,volume,weight,workoutCelebId,videoId,machineSettings}:set) => {
    const [newReps,setNewReps]=useState("");
    const [newWeight,setNewWeight]=useState("");
    const [newRestTime,setNewRestTime ]=useState("");
    const [digitRest,setDigitRest]=useState<number>(0)
    const [typeTime,setTypeTime]=useState<string>("");
    const {mutate} =  trpc.post.createPersonalSets.useMutation();
    const userHistoryRecorder = trpc.post.userSetHistoryRecorder.useMutation();
    const [isModal,setModal]=useState<boolean>(true);
    const [doner,setDoner]=useState(false);
    const notDoneSets = trpc.post.userSetHistoryRecorderDelete.useMutation();
    
    const handlePress=()=>{

  
      if(newReps||newWeight|| newRestTime){
         
        mutate({
          name:name,
          personId:"Fill",
          SetId:id,
          reps:newReps,
          type:type,
          weight:newWeight,
          RestTime:(digitRest).toString(),
          RestType:typeTime,
          order:order,
          exerciseId:exerciseId,
          workoutCelebId:workoutCelebId,
          routineId:routineId
        
        })
        

      }
      
      valSender(isModal,digitRest,videoId,machineSettings)
      userHistoryRecorder.mutate({
        name:name,
        personId:"Fill",
        SetId:id,
        reps:newReps,
        type:type,
        weight:newWeight,
        RestTime:(digitRest).toString(),
        RestType:typeTime,
        exerciseId:exerciseId,
        workoutCelebId:workoutCelebId
      })
      currentSet(order)
      currentExerciseIndex(exoOrder)
      setDoner(true)
      
     
    }
  

    const handleTimeChange=()=>{
      valTimeSender(isModal,id,exerciseId)
    }
    useEffect(()=>{
       
      const pp= parseInt(restTime)
      const minutes = Math.floor(pp/60);
      const seconds = pp%60
      
      
      // Provide a default value of ''
     setNewRestTime((minutes+":"+(seconds < 10 ? "0" : "") + seconds));
     setDigitRest(pp)
    },[restTime])

    useEffect(()=>{
      setDoner(done)
    },[done])
    useEffect(()=>{
      setNewReps(volume)
      setNewWeight(weight)
      setDoner(done)
    
      if(restTime)
    {  const splitt=restTime.split(/(\d+)/).filter(Boolean);
       
        const newRestTime = parseInt(splitt[0] ?? '' )
        const minutes = Math.floor(newRestTime/60);
        const seconds = newRestTime%60
        
        setDigitRest(newRestTime)
        // Provide a default value of ''
       setNewRestTime((minutes+":"+(seconds < 10 ? "0" : "") + seconds));
      
    
    }
    },[])
    
  return (
    <View key={name + id} className={`${doner == false ? 'bg-gray-200' : 'bg-gray-500'}  mb-2 h-[90px] w-full  rounded-[20px] shadow justify-between items-center  flex-row`}>
    <Text className='w-[42px] ml-1 text-black text-base font-light tracking-tight text-center'>Set {order + 1}</Text>
    
    <View className='flex-col rounded-lg  h-full  justify-center items-center mt-7  '>
        <Text className='w-full text-black text-xs font-light tracking-tight text-center'>Reps</Text>
        <Input className='bg-gray-300 text-center  justify-center items-center ' onChangeText={(text) => setNewReps(text)} value={newReps} containerStyle={{ width: 50 }} maxLength={3} inputContainerStyle={{ borderBottomWidth: 0 }} keyboardType="numeric" placeholder={volume} />
    </View>
   

    
    <View className='flex-col justify-center items-center gap-1.5'>
        <Text className='w-full text-black text-xs font-light tracking-tight text-center'>Weight</Text>
        <View className='flex-row justify-center items-center'>
            <Input className='bg-gray-300 text-center  justify-center items-center '  onChangeText={(text) => setNewWeight(text)} value={newWeight} containerStyle={{ width: 50, height: 30 }} maxLength={3} inputContainerStyle={{ borderBottomWidth: 0 }} keyboardType="numeric" placeholder={weight} />
            <Text className='text-center'>kg</Text>
        </View>
    </View>
    
    <View className='flex-col justify-center items-center gap-1.5 mt-1'>
        <Text className='w-[27px] text-black text-xs font-light tracking-tight text-center'>Rest</Text>
        <TouchableOpacity onPress={handleTimeChange} className="w-20 h-10   justify-center items-center">
            <Text className='bg-gray-300 h-10 w-[40px] text-center ' >{newRestTime}</Text>
        </TouchableOpacity>
    </View>
    
    <TouchableOpacity onPress={() => {
        if (doner == false) {
            handlePress();
        } else {
            notDoneSets.mutate({
                SetId: id,
                exerciseId: exerciseId,
                personId: "fill",
                WorkoutCelebId: workoutCelebId
            });
            setDoner(false);
        }
    }} className='w-[51.72px] h-[30px] px-3.5 py-1.5 bg-yellow-300 flex-col justify-center items-center'>
        <Text className='w-[25px] h-3 text-black text-opacity-50 text-[10px] font-light tracking-tight text-center'>{doner ? "Done" : "Start"}</Text>
    </TouchableOpacity>
    
    <TouchableOpacity className='flex h-8 w-8 mr-1 bg-gray-300   justify-center items-center' onPress={() => { removeSet(id, exerciseId) }}>
        <Text > - </Text>
    </TouchableOpacity>
</View>



  )
})

export default SpecificDayComp