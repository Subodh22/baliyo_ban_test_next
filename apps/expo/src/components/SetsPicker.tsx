import { View, Text } from 'react-native'
import React, { useState } from 'react'
import {Picker} from '@react-native-picker/picker';
import AddSetsComp from './AddSetsComp';
import { trpc } from '../utils/trpc';
const SetsPicker = (props:any) => {
  const addSets = trpc.post.createPersonalSets.useMutation();
  const workoutCelebId=props.workoutCelebId
  const exerciseId = props.exerciseId
  // const type = props.type
  // const restType = props.restType
  // const restTime = props.restTime
  
  const order = props.order
  const setId = props.setId
  const name = props.name
  const personId = props.personId
  const addSetsFunc = (sti:string)=>{
   console.log("do your thing ")
    props.change(props.id)
    
  }

return( 
<AddSetsComp 
reps="1"
weight="1"
name=""
setName={1}
newRepsSet={props.setReps}
newWeight={props.setWeight}
addSets={addSetsFunc}
/>



)
}

export default SetsPicker