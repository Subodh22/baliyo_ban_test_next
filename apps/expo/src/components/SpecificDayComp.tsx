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
  workoutCelebId:number
  valSender:Function
  valTimeSender:Function
}
 
 


const SpecificDayComp = React.memo(({id,exerciseId,valTimeSender,name,order,valSender,restTime,type,volume,weight,workoutCelebId}:set) => {
    const [newReps,setNewReps]=useState("");
    const [newWeight,setNewWeight]=useState("");
    const [newRestTime,setNewRestTime ]=useState("");
    const [digitRest,setDigitRest]=useState<number>(0)
    const [typeTime,setTypeTime]=useState<string>("");
    const {mutate} =  trpc.post.createPersonalSets.useMutation();
    const [isModal,setModal]=useState<boolean>(true);

    const handlePress=()=>{
      if(newReps||newWeight|| newRestTime||typeTime){
        
        mutate({
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
         

      }
      
      valSender(isModal,digitRest)

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
      setNewReps(volume)
      setNewWeight(weight)
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
    
    <View key={name+id}  className='bg-gray-200 flex-row justify-between align-center space-between '>
    <Text >{name}</Text>
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
      handlePress()
    }} title="Done" />
   
 </View>
  )
})

export default SpecificDayComp