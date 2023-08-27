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
import AddExerciseTab from '../components/AddExerciseTab';
import FinishedExerciseTab from '../components/FinishedExerciseTab';
 

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
  const [finishedWorkout,setFinished]=useState(false);
  const [sessionId,setSessionId]=useState<boolean>(false);
  const [currentExercise,setCurrentExercise]= useState("");
  const [currentSetIndex,setcurrentSetIndex] = useState(0);
  const [startSess,setStartSess] = useState(false);
  const [currentExerciseIndex,setCurrentExerciseIndex]= useState(0);
  const startSessFunc = trpc.post.createSession.useMutation();
  const [ChangedValue,setChangeValue] = useState(false);

  const {params:{routineId,nameOfDay,workoutCelebId}} = useRoute<CustomScreenRouteProp>();
  // const {data:response,isLoading:isPosting} = trpc.post.getWorkoutExercise.useQuery({routineId: routineId } 
  // ) 
  const addPersonalExercise = trpc.post.addPersonalExercise.useMutation();
  const [exercises, setExercise] =useState<Exercise>([]);
    const {data:checkPersonal,isLoading:isWaiting,refetch}=trpc.post.findPersonalSets.useQuery({
  personId:"fill",
  workoutCelebId:workoutCelebId
},{enabled:false}  ) 
const {data:checkDefault ,refetch:recheckDefault}=trpc.post.getDefaultSetForEx.useQuery({
routineId:routineId
},{enabled:false}  ) 

const checkingSession = trpc.post.searchSession.useQuery({
  WorkoutCelebId:workoutCelebId,
  RoutineId:routineId,
 
})
const [addExo,setAddExo] = useState(false) 
const [addsetTab,setAddsetTab] =useState(false);
const [newReps,setNewReps]=useState("");
const [newWeight,setNewWeight]=useState("");
const [newRestTime,setNewRestTime ]=useState("");
const removeTrpc = trpc.post.removeSets.useMutation();
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
const [sessionNumber,setSessionNumber] = useState<number>();
const [Msettings,setMsettings]=useState<string>("");
const [IdVideo,setIdVideo]=useState<string>("");



const addSess = ()=>
{
    startSessFunc.mutate({
    routineId:routineId,
    workoutCelebId:workoutCelebId
  },{onSuccess:(data)=>
    {
      setSessionNumber(data.id)
      console.log("WHAT UP LOSERS"+data.id)
    }})
}
const handleUpdateRestTime = (routineId: number, exerciseId: number, setId: number, restTime: string) => {
  setExercise((prevExercises) => {
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
  setExercise((prevExercises) => {
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
  Set {currentSetIndex+1}
</Text>
<Text>
 {newReps !==""?newReps: currentExerciseTag?.sets[currentSetIndex]?.volume} of { newWeight !=="" ? newWeight :  currentExerciseTag?.sets[currentSetIndex]?.weight}
</Text>

</>}
      <YoutubeEm videoId={IdVideo}/>
      <Text> This is your machine setting{Msettings}</Text>
      <Button onPress={handleNextSet}  title="Go Rest" />
    </View>:
<Session addSess={addSess}  changeSession={setSessionId} ExerciseName={currentExercise}  />

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
const addPerExercise = ()=>{
  addPersonalExercise.mutate({
    exerciseName:currentExerciseTag!.name,
    machineSettings:currentExerciseTag!.machineSettings,
    type:currentExerciseTag!.type,
    setType: currentExerciseTag!.setType != null ? currentExerciseTag!.setType : "reps",
    exerciseToSet:currentExerciseTag!.id,
    routineId:currentExerciseTag!.routineId,
    videoId:currentExerciseTag!.videoId,
    workoutCelebId:workoutCelebId,
    order:currentExerciseIndex

  })
}
const handleNextSet = ()=> {
  setModal(true)
  console.log("thisi")
  console.log(currentExerciseTag!.sets[currentSetIndex]!.id)
   
  if(currentExerciseTag )
  { if(currentSetIndex<currentExerciseTag.sets.length -1)
    {
      setcurrentSetIndex(prevSetindex=> prevSetindex+1);
      
    }else{
      if (currentExerciseIndex < exercises.length - 1) {

        setCurrentExerciseIndex(prevExerciseIndex => prevExerciseIndex + 1);
        addPerExercise()
        setcurrentSetIndex(0);
      } else {
        addPerExercise()
        setFinished(true)
        closeSessTab()
      }
    }
  }
  

   
 }


const addNewSetsFunction=(name:string)=>{
  let setId =currentExerciseTag!.sets[currentSetIndex]!.id
  let orders = currentExerciseTag!.sets[currentSetIndex]!.order
  if(name=="add"){

    name=`Set ${currentExerciseTag!.sets.length +1}`
    setId =currentExerciseTag!.sets[currentSetIndex]!.id+Math.floor(Math.random()*5000)
    orders = currentExerciseTag!.sets.length
    const newSet:Set = {
      id : setId,
      name:name,
      exerciseId:currentExerciseTag!.id,
      order:orders,
      restTime: currentExerciseTag!.sets[currentSetIndex]!.restTime,
      type:currentExerciseTag!.sets[currentSetIndex]!.type,
      volume:newReps,
      weight:newWeight,
      done:false
    }
    const updatedExercises = exercises.map((exercise) => {
      if (exercise.id == currentExerciseTag!.id) {
        return {
          ...exercise,
          sets: [...exercise.sets, newSet] // Append the new set to the sets array
        };
      }
      return exercise;
    });
  
    setExercise(updatedExercises);
 
    }
   else{
    const updatedExercises = exercises.map((exercise) => {
      if (exercise.id==currentExerciseTag!.id ){
       const updatedSets = exercise.sets.map((set)=>{
         if (set.id==currentExerciseTag!.sets[currentSetIndex]!.id)
         {
          
           return {
             ...set,
             volume:newReps,
             weight:newWeight,
             done:true

           }
         }
         return set;
       });
       return {...exercise,sets:updatedSets};
      }
     return exercise;
     });
     setExercise(updatedExercises);
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
    order:orders,
    exerciseId:currentExerciseTag!.id,
    workoutCelebId:workoutCelebId,
    routineId:routineId
  }) 


  setAddsetTab(false)

}


const NextExerciseStart =()=>{
  
 if (currentExerciseIndex === exercises.length - 1 && currentSetIndex ===currentExerciseTag!.sets.length){
    console.log (currentSetIndex,currentExerciseTag!.sets.length)
    closeSessTab()
  }
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
  if(ChangedValue==true || checkingSession.data?.data=="new user"){
     addNewSetsFunction(currentExerciseTag!.sets[currentSetIndex]!.name)
     setChangeValue(false)
  }
 
    
   

}
 

const closeSessTab = ()=>{
   

setModal(false);
setStartWorkout(false)
setoptionStart(false)   
setNewReps("")
setNewWeight("") 
  
}

 
const removeSet = (id: number,exerciseId:number) => {
  
    Alert.alert(
      'Confirm',
      'Are you sure you want to remove the set ?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => { if (checkingSession.data?.data == "new user") {
            const updatedExo = exercises.map((exercise) => {
              // Filter the sets to exclude the one with the given id
              const updatedSets = exercise.sets.filter(set => set.id !== id);
              return { ...exercise, sets: updatedSets };
            });
        
            // Now, update the state with the modified exercises
            setExercise(updatedExo);
          }
          else{
            removeTrpc.mutate({
              id:id,
              personId:"fill",
              exerciseId:exerciseId
            })
            const updatedExo = exercises.map((exercise) => {
              // Filter the sets to exclude the one with the given id
              const updatedSets = exercise.sets.filter(set => set.id !== id);
              return { ...exercise, sets: updatedSets };
            });
        
            // Now, update the state with the modified exercises
            setExercise(updatedExo);
        
          }}
        }
      ]
    );
 

}

useEffect(() => {
  if (!checkingSession.isLoading && checkingSession.data) {
    const updatedExercises = checkingSession.data.exercises.map((exercise: any) => ({
      ...exercise,
      sets: exercise.sets.map((set: any) => ({
        ...set,
        done: false
      }))
    }));
    setExercise(updatedExercises);
  }
}, [checkingSession.isLoading, checkingSession.data]);

  
 
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
  setName =  {"Set "+( currentSetIndex+1)}
  newRepsSet = {setNewReps}
  newWeight = {setNewWeight}
  ChangedValue= {setChangeValue}
/>
<Button title="Close"  onPress={NextExerciseStart }/>

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
<Modal visible={addExo}>
<AddExerciseTab setExercise={setExercise} goBack={setAddExo} routineId={routineId} workoutcelebId={workoutCelebId} 
size={exercises.length}/>
</Modal>
<Modal visible = {finishedWorkout} animationType='slide'>
  <FinishedExerciseTab setClosed={setFinished} sessionId={sessionNumber}/>
</Modal>
<Button title="add Exercise" onPress={()=>{setAddExo(true)}} />
<FlatList
      data={exercises}
      extraData={exercises}
      keyExtractor={(item) => `${item.routineId}-${item.id}`}
      renderItem={({ item }) => (
        <View key={item.id}>
          <Text>{item.name}</Text>   
            
          <FlatList
          data={item.sets}
          keyExtractor={(set) => `${item.routineId}-${item.id}-${set.name}-s`}
          renderItem={({ item: set,index }) => (
            <SpecificDayComp
              exerciseId={item.id}
              startSess={startSess}
              videoId={item.videoId}
              machineSettings={item.machineSettings}
              id={set.id}
              name={set.name}
              routineId={routineId}
              order={index}
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
              key={`${item.routineId}-${item.id}-${set.id}-${set.name}s`}
              removeSet={removeSet}
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
      
      windowSize={5}
    />
 
 </View>
)
}

export default InsidePage2