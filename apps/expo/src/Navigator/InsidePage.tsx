import { View, Text, Touchable, TouchableOpacity, FlatList, Modal, Platform } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList } from './RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SpecificDayComp from '../components/SpecificDayComp';
import { trpc } from '../utils/trpc';

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Button } from '@rneui/base';
import { TimePicker, ValueMap } from 'react-native-simple-time-picker';
import YoutubeEm from '../components/YoutubeEm';

type Set = {
  exerciseId: number;
  id: number;
  name: string;
  order: number;
  restTime: string;
  type: string;
  volume: string;
  weight: string;
};

type Exercise = {
  id: number;
  name: string;
  type: string;
  setType: string | null;
  order: number;
  routineId: number;
  videoId:string;
  machineSettings:string;
  sets: Set[];
}[];

type Routine = {
  id: number;
  weekRoutine: string;
  exercises: Exercise[];
  order: number;
};

type Celeb = {
  id: number;
  name: string;
  ratings: string;
  routines: Routine[];
} | null | undefined;

interface TimerModalProps {
  isOpen: boolean;
  
  duration: number;
}

type CustomScreenRouteProp = RouteProp<RootStackParamList, "Inside">;
type InsidenProp = NativeStackNavigationProp<RootStackParamList, 'Custom'>;


const InsidePage = () => {
    const navigation = useNavigation<InsidenProp>();
    const {params:{routineId,nameOfDay,workoutCelebId}} = useRoute<CustomScreenRouteProp>();
    const {data:response,isLoading:isPosting} = trpc.post.getWorkoutExercise.useQuery({routineId: routineId },
    )
    const [exercises, setResponse] =useState<Exercise>([]);
      const {data:checkPersonal,isLoading:isWaiting}=trpc.post.findPersonalSets.useQuery({
    personId:"fill",
    workoutCelebId:workoutCelebId
  }  ) 
  const [isOpen,setModal]=useState<boolean>(false);
  const [chosenTime,setChosenTime] =useState<Date>(new Date())
  const [duration,setDuration] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedExercise, setSelectExerciseId] = useState<number>(0);
  const [istimePickerVisible, setIsTimePickerVisible] = useState<boolean>(false);
  const [startWorkout,setStartWorkout] =useState<boolean>(false);
  const [optionsStart,setoptionStart] =useState<boolean>(false);
  const [finishWorkout,SetFinsihWorkout] = useState<boolean>(false);
  const [Msettings,setMsettings]=useState<string>("");
  const [IdVideo,setIdVideo]=useState<string>("");
  const handleUpdateRestTime = (routineId: number, exerciseId: number, setId: number, restTime: string) => {
    setResponse((prevExercises) => {
      const updatedExercises = prevExercises.map((exercise) => {
        if (exercise.routineId === routineId && exercise.id === exerciseId) {
          const updatedSets = exercise.sets.map((set) => {
            if (set.id === setId) {
              return { ...set, restTime };
            }
            return set;
          });
          return { ...exercise, sets: updatedSets };
        }
        return exercise;
      });
      return updatedExercises;
    });
  };
  const ExpoCountdown=()=>{
    const [value,setValue] = useState<ValueMap>(
      { hours: 1,
        minutes: 0,
        seconds: 0,}
    )
    const handleChange = (newValue: ValueMap) => {
      setValue(newValue);
    };
    const pressed=()=>
    {
        
       const newDura= (value.hours*60+ value.minutes).toString()
       handleUpdateRestTime(routineId,selectedExercise,selectedId,newDura)
     
      
       setIsTimePickerVisible(false)

    }
    return(< View className='pt-20'> 
    
          <TimePicker
          textColor='blue'
             
          value={value} onChange={handleChange}
          />
          <Button title="ok" onPress={pressed} />
        </View>
  
   
    )
  }
  const onPressedFinishing=()=>{
    setoptionStart(false)
    
  }
  const StartWorking = React.memo(({IdVideo}:any)=>{
     console.log("changing")
    return(
      <View className='flex justify-center h-screen'>
        <YoutubeEm videoId={IdVideo}/>
        <Text> This is your machine setting{Msettings}</Text>
        <Button onPress={()=>{setModal(true)}}  title="Go Rest" />
      </View>
    )
  },(prevProps,nextProps)=>prevProps.IdVideo===nextProps.IdVideo)
  const FinishWorking = ()=>{
    return(
      <View className='flex justify-center h-screen'>
       
        <Button onPress={onPressedFinishing}  title="Done" />
      </View>
    )
  }
  const passTheTimer=(isOpene:boolean,isfunId:number,routineIdx:number)=>
  {
    setIsTimePickerVisible(isOpene)
    setSelectedId(isfunId)
    setSelectExerciseId(routineIdx)
 
  }

 
  const passTheValue=(isOpene:boolean,duration:number,IdVideo:string,settingMachine:string)=>{
    setoptionStart(isOpene);
    setStartWorkout(isOpene)
    setDuration(duration);
    setIdVideo(IdVideo);
    setMsettings(settingMachine);
    console.log("isoops"+isOpene)

  }
 
  
 
  useEffect(()=>{
  
    if (checkPersonal&&response) {
      const updatedResponse = response.map((exercise) => {
        const updatedSets = exercise.sets.map((set) => {
          const matchingSet = checkPersonal.find((personalSet) => personalSet.SetId === set.id);
         
          if (matchingSet) {
            const updatedSet = {
              ...set,
              volume: matchingSet.reps,
              weight: matchingSet.weight,
              restTime: matchingSet.RestTime+ matchingSet.RestType
            };
            return updatedSet;
          }
          return set;
          
        });

        return { ...exercise, sets: updatedSets };
      });
      setResponse(updatedResponse)
       
    }





  },[response,checkPersonal])
 
 
    useLayoutEffect(()=>
    (
      navigation.setOptions({
      headerTitle:nameOfDay
      })
    ),[])
  return (
  
    <View> 
 
<Modal visible={istimePickerVisible} animationType='slide'>
<ExpoCountdown/>
</Modal>

<Modal visible ={optionsStart}>
 {startWorkout && <StartWorking IdVideo={IdVideo}/>}
  <Modal visible={isOpen} animationType='slide' > 

<CountdownCircleTimer
  isPlaying
  duration={duration}
  colors={['#004777', '#F7B801', '#A30000', '#A30000']}
  colorsTime={[7, 5, 2, 0]}
 
>
  {({ remainingTime }) => 
{  if(remainingTime===0){
     setStartWorkout(false)
     setModal(false)
     SetFinsihWorkout(true)
    return(
      <Text>Times Up</Text>

    )
     
  }
  else{
    const minutes = Math.floor(remainingTime/60);
    const seconds = remainingTime%60
    return(
      <> 
      <Text>{minutes}minutes</Text>
      <Text>{seconds}seconds</Text></>
    )
  }}
  }
  
  </CountdownCircleTimer>
<Button title="Close" onPress={()=>{SetFinsihWorkout(true)
  setModal(false);
  setStartWorkout(false)
                                   
                                     }} />
</Modal>
  
 {finishWorkout&& <FinishWorking/>}
 
</Modal>

<FlatList
        data={exercises}
        keyExtractor={(item) => `${item.routineId}-${item.id}`}
        renderItem={({ item }) => (
          <View key={item.id}>
            <Text>{item.name}</Text>
            <FlatList
            data={item.sets}
            keyExtractor={(set) => `${item.routineId}-${item.id}-${set.id}`}
            renderItem={({ item: set }) => (
              <SpecificDayComp
                exerciseId={item.id}
                videoId={item.videoId}
                machineSettings={item.machineSettings}
                id={set.id}
                name={set.name}
                order={set.order}
                restTime={set.restTime}
                valSender={passTheValue}
                valTimeSender={passTheTimer}
                type={set.type}
                volume={set.volume}
                weight={set.weight}
                workoutCelebId={workoutCelebId}
                key={`${item.routineId}-${item.id}-${set.id}-s`}
              />
            )}
           
          />
          </View>
        )}
        initialNumToRender={2}
        extraData={exercises}
        windowSize={5}
      />
   
   </View>
  )
}

export default InsidePage