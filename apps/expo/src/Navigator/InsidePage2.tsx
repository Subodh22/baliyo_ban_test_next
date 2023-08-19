import { View, Text, Touchable, TouchableOpacity, FlatList, Modal, Platform } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute  } from '@react-navigation/native'
import { RootStackParamList } from './RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SpecificDayComp from '../components/SpecificDayComp';
import { trpc } from '../utils/trpc';
import { BackHandler, Alert } from 'react-native';
 
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Button } from '@rneui/base';
import { TimePicker, ValueMap } from 'react-native-simple-time-picker';
import YoutubeEm from '../components/YoutubeEm';
import Session from '../components/Session';
import NextExerciseInRest from '../components/NextExerciseInRest';
import AddSetsComp from '../components/AddSetsComp';
import BackHandlerbe from '../components/BackHandlerbe';
 

type Set = {
  exerciseId: number;
  id: number;
  name: string;
  order: number;
  restTime: string;
  type: string;
  volume: string;
  weight: string;
  done:boolean
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
type result = {
  id: number;
  name: string;
  type: string;
  setType: string | null;
  order: number;
  routineId: number;
  videoId: string;
  machineSettings: string;
}

type CustomScreenRouteProp = RouteProp<RootStackParamList, "Inside">;
type InsidenProp = NativeStackNavigationProp<RootStackParamList, 'Custom'>;


const InsidePage2 = () => {
  const navigation = useNavigation<InsidenProp>();
  const [sessionId,setSessionId]=useState<boolean>(false);
  const [currentExercise,setCurrentExercise]= useState("");
  const [currentSetIndex,setcurrentSetIndex] = useState(0);
  const [startSess,setStartSess] = useState(false);
  const [currentExerciseIndex,setCurrentExerciseIndex]= useState(0);
  const {params:{routineId,nameOfDay,workoutCelebId}} = useRoute<CustomScreenRouteProp>();
  const {data:response,isLoading:isPosting} = trpc.post.getWorkoutExercise.useQuery({routineId: routineId },
  )
  const [exercises, setResponse] =useState<Exercise>([]);
    const {data:checkPersonal,isLoading:isWaiting,refetch}=trpc.post.findPersonalSets.useQuery({
  personId:"fill",
  workoutCelebId:workoutCelebId
}  ) 


const [addsetTab,setAddsetTab] =useState(false);
const [newReps,setNewReps]=useState("");
const [newWeight,setNewWeight]=useState("");
const [newRestTime,setNewRestTime ]=useState("");
 const userHistoryRecorder = trpc.post.userSetHistoryRecorder.useMutation();
const addNewSets =  trpc.post.createPersonalSets.useMutation(
  {
    onSuccess:()=>{
      refetch();
     
    }
  }
);
const [doneExercise,setDoneExercise]= useState([])
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
const [unsaved,setUnsaved] = useState("aaa")
 


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
const handleDoneExercise = (routineId: number, exerciseId: number, setId: number, done: boolean) => {
  setResponse((prevExercises) => {
    const updatedExercises = prevExercises.map((exercise) => {
      if (exercise.routineId === routineId && exercise.id === exerciseId) {
        const updatedSets = exercise.sets.map((set) => {
          if (set.id === setId) {
            return { ...set, done };
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
 
const StartWorking =  ({IdVideo}:any)=>{

  
  return(
    <> 
    
   {sessionId  ?  <View className='flex justify-center h-screen'>
   {exercises&&<>
  <Text>
  {currentExerciseTag?.name}
</Text>
  <Text>
  {currentExerciseTag?.sets[currentSetIndex]?.name}
</Text>
<Text>
 {newReps !==""?newReps: currentExerciseTag?.sets[currentSetIndex]?.volume} of { newWeight !=="" ? newWeight :  currentExerciseTag?.sets[currentSetIndex]?.weight}
</Text>

</>}
      <YoutubeEm videoId={IdVideo}/>
      <Text> This is your machine setting{Msettings}</Text>
      <Button onPress={handleNextSet}  title="Go Rest" />
    </View>:
<Session  changeSession={setSessionId} ExerciseName={currentExercise}  />

  }</>
  
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


}
const currentExerciseTag = exercises[currentExerciseIndex]
const handleNextSet = ()=> {
  setModal(true)
 
  if(currentExerciseTag )
  { if(currentSetIndex<currentExerciseTag.sets.length -1)
    {
      setcurrentSetIndex(prevSetindex=> prevSetindex+1);

    }else{
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(prevExerciseIndex => prevExerciseIndex + 1);
        setcurrentSetIndex(0);
      } else {
        console.log('All exercises and sets are completed!');
      }
    }
  }
  

   
 }

const addNewSetsFunction=(name:string)=>{
  let setId =currentExerciseTag!.sets[currentSetIndex]!.id
  if(name=="add"){
    name=`Set ${currentExerciseTag!.sets.length +1}`
    setId =currentExerciseTag!.sets[currentSetIndex]!.id+Math.floor(Math.random()*5000)
     
  }
 
  addNewSets.mutate({
    name:name,
    personId:"Fill",
    SetId:setId,
    reps:newReps,
    type:currentExerciseTag!.sets[currentSetIndex]!.type,
    weight:newWeight,
    RestTime:(currentExerciseTag!.sets[currentSetIndex]!.restTime).toString(),
    RestType:"s",
    exerciseId:currentExerciseTag!.id,
    workoutCelebId:workoutCelebId,
  
  }) 
  setAddsetTab(false)

}


const NextExerciseStart =()=>{
  handleDoneExercise(routineId,currentExerciseTag!.id,currentExerciseTag!.sets[currentSetIndex]!.id,true)
 
  setStartWorkout(true)
  setModal(false)
  const duratione  = parseInt(currentExerciseTag!.sets[currentSetIndex]!.restTime )
  setDuration(duratione);
 
  const videoId = currentExerciseTag?.videoId
  setIdVideo(videoId!);
  const machineSet = currentExerciseTag?.machineSettings
  setMsettings(machineSet!);
  userHistoryRecorder.mutate({
    name:currentExerciseTag!.sets[currentSetIndex]!.name,
    personId:"Fill",
    SetId:currentExerciseTag!.sets[currentSetIndex]!.id,
    reps:newReps,
    type:currentExerciseTag!.sets[currentSetIndex]!.type,
    weight:newWeight,
    RestTime:(currentExerciseTag!.sets[currentSetIndex]!.restTime).toString(),
    RestType:"s",
    exerciseId:currentExerciseTag!.id,
    workoutCelebId:workoutCelebId
  })
   

   
   if(  currentExerciseTag!.sets[currentSetIndex]!.volume !==newReps ||currentExerciseTag!.sets[currentSetIndex]!.weight !==newWeight ){
    addNewSetsFunction(currentExerciseTag!.sets[currentSetIndex]!.name)
      
      }
     
  if (currentExerciseIndex === exercises.length - 1){
    closeSessTab()
  }
    
   

}
 

const closeSessTab = ()=>{
  SetFinsihWorkout(true)
setModal(false);
setStartWorkout(false)
setoptionStart(false)   
setNewReps("")
setNewWeight("")   
}
useEffect(()=>{

  if (checkPersonal&&response) {
   
    const updatedResponse = response.map((exercise,exeindex) => {
      const existingSetIds = exercise.sets.map(set => set.id);

      const updatedSets = exercise.sets.map((set,index) => {
        const matchingSet = checkPersonal.find((personalSet) => personalSet.SetId === set.id);
         
        if (matchingSet) {
          console.log( matchingSet?.reps+"hooter"+exercises[exeindex]?.sets[index]?.volume)
          if(exercises[exeindex]?.sets[index]?.done)
          {
            console.log("I EXIST MY LORD")
          }
          const updatedSet = {
            ...set,
            volume: matchingSet.reps,
            weight: matchingSet.weight,
            restTime: matchingSet.RestTime+ matchingSet.RestType,

            done: exercises[exeindex]?.sets[index]?.done || false
          }
        
          return updatedSet;
        }  else{
          const updatedSet = {
            ...set,
           
            done:exercises[exeindex]?.sets[index]?.done || false
          };
          return updatedSet;
          
        }  
        
       
        
      });

      const additionalSets = checkPersonal.filter(personalSet => 
        
        personalSet.exerciseId === exercise.id &&!existingSetIds.includes(personalSet.SetId)).map(personalSet => ({
        id: personalSet.SetId,
        volume: personalSet.reps,
        weight: personalSet.weight,
        restTime: personalSet.RestTime + personalSet.RestType,
        done: false,
        name:personalSet.name,
        order: personalSet.id,
        type:personalSet.type,
        exerciseId:personalSet.exerciseId



    }));

    // Merge updatedSets with additionalSets
    return { ...exercise, sets: [...updatedSets, ...additionalSets] };


    });
    
    setResponse(updatedResponse)
     
  }



 

},[response,checkPersonal])
 
  useLayoutEffect(()=>
  (
    navigation.setOptions({
    headerTitle:nameOfDay,
    headerLeft:()=> <BackHandlerbe sessionId={sessionId} />,
    gestureEnabled: false,
    })
  ),[sessionId])
return (

  <View> 

<Modal visible={istimePickerVisible} animationType='slide'>
<ExpoCountdown/>
</Modal>

<Modal visible ={optionsStart}>
 <TouchableOpacity className='absolute top-2.5 right-2.5 p-2.5 z-10 pt-10' onPress={closeSessTab}>
            <Text >Go back</Text>
          </TouchableOpacity>
{startWorkout && <StartWorking IdVideo={IdVideo}/>}
 
<Modal visible={isOpen}  > 
<View className='pt-20'> 
<CountdownCircleTimer
isPlaying
duration={duration}
colors={['#004777', '#F7B801', '#A30000', '#A30000']}
colorsTime={[7, 5, 2, 0]}

>
{({ remainingTime }) => 
{  if(remainingTime===0){
  NextExerciseStart()
 
  //  SetFinsihWorkout(true)
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
</View>
<NextExerciseInRest Weight={currentExerciseTag?.sets[currentSetIndex]?.weight} reps={currentExerciseTag?.sets[currentSetIndex]?.volume}
  name=  {currentExerciseTag?.name}
  setName =  {currentExerciseTag?.sets[currentSetIndex]?.name}
  newRepsSet = {setNewReps}
  newWeight = {setNewWeight}
/>
<Button title="Close" onPress={NextExerciseStart }/>

</Modal>



</Modal>
<Modal visible ={addsetTab}>
  <TouchableOpacity className='absolute top-2.5 right-2.5 p-2.5 z-10 pt-10'
  onPress={()=>{setAddsetTab(false)
    setNewReps("")
    setNewWeight("")
  }}
  >
    <Text>
      Go back
    </Text>
  </TouchableOpacity>
<AddSetsComp
addSets={addNewSetsFunction}
setId = {currentExerciseTag?.sets[currentSetIndex]?.id} 
Weight={currentExerciseTag?.sets[currentSetIndex]?.weight} 
reps={currentExerciseTag?.sets[currentSetIndex]?.volume}
name={currentExerciseTag?.name}  setName = {currentExerciseTag?.sets.length}  newRepsSet={setNewReps} newWeight={setNewWeight}/>
 
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
              startSess={startSess}
              videoId={item.videoId}
              machineSettings={item.machineSettings}
              id={set.id}
              name={set.name}
              order={set.order}
              restTime={set.restTime}
              valSender={passTheValue}
              valTimeSender={passTheTimer}
              currentSet={setcurrentSetIndex}
              exoOrder={item.order}
              currentExerciseIndex={setCurrentExerciseIndex}
              type={set.type}
              volume={set.volume}
              done={set.done}
              weight={set.weight}
              workoutCelebId={workoutCelebId}
              key={`${item.routineId}-${item.id}-${set.id}-s`}
              
            />
          )}
         
        />
        <Button title="add sets" 
        onPress={()=>{setAddsetTab(true)
                      setCurrentExerciseIndex(item.order)}
      }
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

export default InsidePage2