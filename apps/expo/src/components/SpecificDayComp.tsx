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
    
    <View key={name+id}  className={`${doner==false? 'bg-gray-200':'bg-gray-500'} flex-row justify-between align-center space-between `}>
    <Text > Set {order+1}</Text>
    <View> 
    <Text className=''>reps</Text>
     
    <Input onChangeText={(text)=>setNewReps(text)}  value={newReps}containerStyle={{ width: 50 }} maxLength={3} inputContainerStyle={{ borderBottomWidth: 0 }}  keyboardType="numeric" placeholder={volume}/>
    </View>
    <View> 
    <Text>Weight</Text> 
    <View className='flex-row justify-center items-center  '> 
      <Input  onChangeText={(text)=>setNewWeight(text)}  value={newWeight} containerStyle={{ width: 50,height:30}} maxLength={3} inputContainerStyle={{ borderBottomWidth: 0 }}  keyboardType="numeric" placeholder={weight}/>
    <Text >kg</Text>
    </View>
  </View>
    <View> 
    <Text>rest</Text>
    <View className="flex-row "> 
    {/* <Input  onChangeText={(text)=>setNewRestTime(text)}  value={newRestTime} containerStyle={{ width: 50 }} inputContainerStyle={{ borderBottomWidth: 0 }} maxLength={3}  keyboardType="numeric" placeholder={restTime}/> */}
   
   <TouchableOpacity onPress={handleTimeChange} className="w-20 h-10 bg-blue-300">
    <Text>
      {newRestTime}
    </Text>
   </TouchableOpacity>
    </View>
     
     </View>
     
    <Button onPress={()=>{
      if(doner ==false)
      {
        handlePress()
      }
      else{
        notDoneSets.mutate({
          SetId:id,
          exerciseId:exerciseId,
          personId:"fill",
          WorkoutCelebId:workoutCelebId

        })
        setDoner(false)
      }
    }}
    
    title={
      doner? "Done": "Start"
    } />
     <TouchableOpacity className='h-10 w-10 bg-white justify-center ' onPress={()=>{removeSet(id,exerciseId)}}>
      <Text> - </Text>
     </TouchableOpacity>
   
 </View>
  )
})

export default SpecificDayComp