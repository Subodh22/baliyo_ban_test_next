import { View, Text, Touchable, TouchableOpacity, FlatList, Modal, Platform } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute  } from '@react-navigation/native'
 
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
import { SafeAreaView } from 'react-native-safe-area-context';
import secleft from '../../assets/audio/30secleft.mp3'
import addtime from '../../assets/audio/addtime.wav'
import next from '../../assets/audio/next.wav'
import nextExercise from '../../assets/audio/nextExercise.wav'
import unmuteBtn from '../../assets/Icons/unmute.png'
import muteBtn from '../../assets/Icons/mute.png'
import  {Audio  } from 'expo-av'; 
 
import { Sound } from 'expo-av/build/Audio/Sound';
import { Image } from 'react-native-elements';
import TimePickers from '../components/TimePickers';
import DoneForInsidePage from '../components/DoneForInsidePage';
import { RootStackParamList } from '../types/NavigationTypes';
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
  exerciseToSet: number;
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
 
   
  
 

  const [mute,setMute]=useState(false);
  const navigation = useNavigation<InsidenProp>();
  const [finishedWorkout,setFinished]=useState(false);
  const [sessionId,setSessionId]=useState<boolean>(false);
  const [currentExercise,setCurrentExercise]= useState("");
  const [currentSetIndex,setcurrentSetIndex] = useState(0);
  const [startSess,setStartSess] = useState(false);
  const [currentExerciseIndex,setCurrentExerciseIndex]= useState(0);
  const startSessFunc = trpc.post.createSession.useMutation();
  const [ChangedValue,setChangeValue] = useState(false);
  const [lastPlayedTime, setLastPlayedTime] = useState(0);
  const {params:{topicId, routineId,nameOfDay,workoutCelebId,planLength,currentWeek,currentStatus,currentWeekLength,pPId}} = useRoute<CustomScreenRouteProp>();
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
const [PersonalExerciseId,setPersonalExerciseId] = useState<number|null>()
const [addExo,setAddExo] = useState(false) 
const [addsetTab,setAddsetTab] =useState(false);
const [newReps,setNewReps]=useState("");
const [newWeight,setNewWeight]=useState("");
const [newRestTime,setNewRestTime ]=useState("");
const [editNextSet,setEditNextSet]=useState(false)
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
const [sound, setSound] = useState<Sound>();
const MemoizedYoutubeEm = React.memo(YoutubeEm,(prevProps,NextProps)=>
{
  console.log("ran wagain")
  return prevProps.videoId ===NextProps.videoId
});
 
async function initializeAudio() {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: 2,
      shouldDuckAndroid: true,
      interruptionModeAndroid: 1,
      playThroughEarpieceAndroid: false,
   
    });
  } catch (error) {
    console.error("Error initializing audio:", error);
  }
}

 
useEffect(() => {
  initializeAudio();
  // console.log("exercises state updated:", exercises[currentExerciseIndex]?.sets[currentSetIndex]?.weight);
}, [exercises]);
const updateExe=()=>
{
  console.log("updateExe is being called");
  const updatedExercises = exercises.map((exercise) => {
    if (exercise.id==currentExerciseTag!.id ){
     const updatedSets = exercise.sets.map((set)=>{
       if (set.id==currentExerciseTag!.sets[currentSetIndex]!.id)
       {
        console.log(newReps+"mental")
         return {
          
           ...set,
           volume:newReps,
           weight:newWeight,
          

         }
        
       }
       return set;
     });
     return {...exercise,
      
      sets:updatedSets};
    }
   return exercise;
   });
   setExercise(updatedExercises);
   console.log(exercises[currentExerciseIndex]?.sets[currentSetIndex]?.weight)

 }
 async function stopSound() {
  if (sound) {
    await sound.stopAsync();
  }
}
async function playSound(song:any) {

  if(mute==false)
  {await Audio.setAudioModeAsync({
    
    playsInSilentModeIOS: true,
   
  });
  const sound = new Audio.Sound();
  console.log("waht")
  try {
    await sound.loadAsync(song);
    await sound.playAsync();
    
    setSound(sound)
     
  } catch (error) {
    console.error("Couldn't load the sound", error);
  }}
}

const addSess = ()=>
{
  console.log(nameOfDay)
    startSessFunc.mutate({
    routineId:routineId,
    workoutCelebId:workoutCelebId,
    routineName:nameOfDay
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
  return(< View className='pt-20 m-2'> 
         <Text className='text-black text-[20px]  font-light tracking-tight'>Rest Time :</Text>
        {/* <TimePicker 
        textColor='black'
        dropdownIconColor='blue'
        style={{width:'100%', height:200}}
        zeroPadding
       
        selectedValue={5}
          
        value={value} onChange={handleChange}
        /> */}
        <TimePickers value setValue={setValue}/>
        
        <TouchableOpacity className='h-[50px] mt-2 bg-yellow-300  justify-center items-center flex'  onPress={pressed }>
  <Text className='text-black text-[15px]  font-light tracking-tight'>Ok</Text>
</TouchableOpacity>
 
         
      </View>

 
  )
}
 
 
const StartWorking =  ({IdVideo}:any)=>{
  
  
  return(
    <> 
    
   {sessionId  ?  <View className='flex  h-screen mt-2 '>
   {exercises&&<View className='m-2'>
   <View className='h-10 mb-3 w-auto justify-center items-center bg-yellow-300  flex-row '> 
  <Text className='text-black pl-2 text-[20px] font-light tracking-tight'> 
  {currentExerciseTag?.name}
</Text></View>
  <Text className='text-black text-[15px] font-light tracking-tight'>
  Set {currentSetIndex+1}
</Text> 
<View className=' w-auto flex-row '> 
<Text className='text-black text-[15px] font-light tracking-tight'>
 {newReps !==""?newReps: currentExerciseTag?.sets[currentSetIndex]?.volume} reps of  
</Text>
<Text className=' bg-yellow-300 ml-1 text-black text-[15px] font-light tracking-tight'>
 { newWeight !=="" ? newWeight :  currentExerciseTag?.sets[currentSetIndex]?.weight} kg
</Text>

</View>
<View className='mt-1 w-auto flex-row justify-between items-center '> 
<Text className=' bg-yellow-300 ml-1 text-black text-[15px] font-light tracking-tight'>
  How to :
</Text>
<TouchableOpacity className=' ' onPress={()=>{
  setMute((prev)=>!prev)
}}>
 <Image 
    source={mute ? muteBtn : unmuteBtn} 
    style={{ width: 30, height: 30 }} 
    resizeMode="contain"
  />
</TouchableOpacity>


</View>
</View>} 
      <MemoizedYoutubeEm className='bg-yellow-300' videoId={IdVideo}/>
      {/* <Text> This is your machine setting{Msettings}</Text> */}
      
      <TouchableOpacity className='h-12 w-auto  justify-center items-center bg-yellow-300 flex ' onPress={handleNextSet} >
        <Text className=' text-black text-[20px] font-light tracking-tight'>Go Rest</Text>
      </TouchableOpacity>
      
      </View>
     :
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
    order:currentExerciseIndex,
    idTofill:""

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
        if( checkingSession.data?.data=="new user")
       { addPerExercise()}
       
        setcurrentSetIndex(0);
      } else {
        if( checkingSession.data?.data=="new user")
        { addPerExercise()}
      
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
      exerciseId:currentExerciseTag!.exerciseToSet ?currentExerciseTag!.exerciseToSet:
      currentExerciseTag!.id,
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
    exerciseId:currentExerciseTag!.exerciseToSet ?currentExerciseTag!.exerciseToSet:
      currentExerciseTag!.id
    ,
    workoutCelebId:workoutCelebId,
    routineId:routineId
  }) 


  setAddsetTab(false)

}


const NextExerciseStart =()=>{
  
  stopSound()
  playSound(nextExercise)
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
    headerTitleAlign:'center',
    headerLeft:()=> <BackHandlerbe sessionId={sessionId} />,
    gestureEnabled: false,
    })
  ),[sessionId])
return (

  <View className='flex-1'  > 

<Modal visible={istimePickerVisible} animationType='slide'>
<ExpoCountdown/>
</Modal>
 
<Modal visible ={optionsStart}>
 <TouchableOpacity className=' w-[80px]  h-[40px] mt-10 mx-3  bg-yellow-300 flex-col justify-center items-center flex' onPress={closeSessTab}>
            <Text  >Go back</Text>
          </TouchableOpacity>
{startWorkout && <StartWorking IdVideo={IdVideo}/>}
 
<Modal visible={isOpen}   > 
<View className='m-2'> 

<View className='pt-20'> 
<View className='  h-[35px] w-[120px] px-2 flex item-center justify-center bg-yellow-300 '> 
<Text  className='text-black text-[15px]  font-light tracking-tight'>Next Exercise :</Text></View>
<MemoizedYoutubeEm videoId={currentExerciseTag?.videoId}/>
<View className='flex-row justify-between w-auto '> 

<View >
<NextExerciseInRest Weight={currentExerciseTag?.sets[currentSetIndex]?.weight} reps={currentExerciseTag?.sets[currentSetIndex]?.volume}
  name=  {currentExerciseTag?.name}
  setName =  {"Set "+( currentSetIndex+1)}
  newRepsSet = {setNewReps}
  newWeight = {setNewWeight}
  ChangedValue= {setChangeValue}
  changedEdit= {setEditNextSet}
  setDuration={setDuration}
  updatedExe={updateExe}
/>

</View>
<CountdownCircleTimer
isPlaying
duration={duration}
colors='#FFF178'

>
{({ remainingTime }) => 
{
   const checkpoint = [60,30,6]
  if (checkpoint.includes(remainingTime) && remainingTime !==lastPlayedTime) {
    console.log("trying to play");
    
    if(remainingTime==60)

    { 
      //  playSound(addtime)
      const randomInt = Math.floor(Math.random() * 5) ;
      if(randomInt==3){
        playSound(addtime)
      }
    
    }
    if(remainingTime==30)
    {playSound(secleft)
    
    }
    if(remainingTime==6)
    {
      playSound(next)
    }
   setLastPlayedTime(remainingTime)
    
  }
  
 
  
  
  
  if(remainingTime===0){
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
    <Text className='text-black text-[15px]  font-light tracking-tight'>{minutes} minutes</Text>
    <Text className='text-black text-[15px]  font-light tracking-tight'>{seconds} seconds</Text></>
  )
}}
}

</CountdownCircleTimer>

</View>
</View>
<TouchableOpacity className='h-[60px] mt-2 bg-yellow-300  justify-center items-center flex'  onPress={()=>{
NextExerciseStart()
 
} }>
  <Text className='text-black text-[15px]  font-light tracking-tight'>Next</Text>
</TouchableOpacity>
 
</View>
</Modal>
 


</Modal>
<Modal visible ={addsetTab}>
   
<AddSetsComp
addSets={addNewSetsFunction}
setId = {currentExerciseTag?.sets[currentSetIndex]?.id} 
Weight={currentExerciseTag?.sets[currentSetIndex]?.weight} 
reps={currentExerciseTag?.sets[currentSetIndex]?.volume}
name={currentExerciseTag?.name}
setAddsetTab={setAddsetTab}
setNewReps={setNewReps}
setNewWeight={setNewWeight}
setName = {currentExerciseTag?.sets.length}  newRepsSet={setNewReps} newWeight={setNewWeight}/>

</Modal>
<Modal visible={addExo}>
<AddExerciseTab   setExercise={setExercise} goBack={setAddExo} routineId={routineId} workoutcelebId={workoutCelebId} 
size={exercises.length}/>
</Modal>
<Modal visible = {finishedWorkout} animationType='slide'>
  <FinishedExerciseTab topicId={topicId? `challenges/${topicId.toString()}`: `workout/${routineId} `} planLength={planLength} pPId={pPId} currentWeek={currentWeek} currentWeekLength={currentWeekLength} currentStatus={currentStatus} setClosed={setFinished} sessionId={sessionNumber}/>
</Modal>

  {/* <SafeAreaView style={{ backgroundColor: 'transparent' }}> */}
      <TouchableOpacity 
        onPress={() => { setAddExo(true) }} 
        className=" top-0 w-[150px] h-12 m-2 p-2.5 bg-yellow-300 flex justify-center items-center"
      >
        <Text className="text-black text-[15px] font-light tracking-tight">add Exercise</Text>
      </TouchableOpacity>
    {/* </SafeAreaView> */}

<FlatList

      data={exercises}
      extraData={exercises}
      keyExtractor={(item) => `${item.routineId}-${item.id}`}
      renderItem={({ item }) => (
        <View key={item.id} className='px-[10px] py-[15px] bg-gray-200  flex-col justify-start  gap-2.5 inline-flex"'>
          <Text className="text-black text-[15px] font-light tracking-tight">{item.name}{item.exerciseToSet?item.exerciseToSet:item.id}</Text>   
            
          <FlatList
          data={item.sets}
          keyExtractor={(set) => `${item.routineId}-${item.id}-${set.volume}-${set.name}-${set.weight}-s`}
          renderItem={({ item: set,index }) => (
            <SpecificDayComp
              exerciseId={item.exerciseToSet?item.exerciseToSet:item.id}
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
        <TouchableOpacity className="w-fit h-[51px] px-[120px] py-[11px] bg-yellow-300 justify-center flex items-center"
        onPress={()=>{setAddsetTab(true)
                      setCurrentExerciseIndex(item.order)}
      }
         >
          <Text className=" text-black text-center text-[15px] font-light tracking-tight">add sets</Text></TouchableOpacity> 

     
        </View>
      )}
      initialNumToRender={2}
      
      windowSize={5}
    />
  
 </View>
)
}

export default InsidePage2