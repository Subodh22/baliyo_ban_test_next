import { View, Text, Touchable, TouchableOpacity, FlatList, Modal, Platform } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList } from './RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SpecificDayComp from '../components/SpecificDayComp';
import { trpc } from '../utils/trpc';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Button } from '@rneui/base';
import { TimePicker, ValueMap } from 'react-native-simple-time-picker';

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
     
    const pressed=()=>
    {
        
       const newDura= (value.hours*60+ value.minutes).toString()
       handleUpdateRestTime(routineId,selectedExercise,selectedId,newDura)
      
      //  setResponse (prev => {
      //   if (!prev) {
      //     const updatedResponse: Exercise = [];
      //     // Handle the case when prev is null or undefined
      //     // Perform any necessary operations for the null case
      //     return updatedResponse;
      //   } else {
      //     const updatedResponse: Exercise = prev.map(exercise => {
      //       if (exercise.id === selectedRoutineId) {
      //         const updatedExercise = {
      //           ...exercise,
      //           sets: exercise.sets.map(set => {
      //             if (set.id === selectedId) {
      //               return {
      //                 ...set,
      //                 restTime: (value.hours * 60 + value.minutes).toString()
      //               };
      //             }
                  
      //             return set;
      //           })
      //         };
      //         return { ...exercise, sets: updatedSets };
      //       }
      //       return {...exercise};
      //     });
          
      //     return [...updatedResponse];
      //   }
      // });
      
       setIsTimePickerVisible(false)

    }
    return(< View className='pt-20'> 
    
          <TimePicker
          textColor='blue'
             
            onChange={(newvalue:ValueMap) => {
              setValue(newvalue)
            }}
          />
          <Button title="ok" onPress={pressed} />
        </View>
  
   
    )
  }

  const passTheTimer=(isOpene:boolean,isfunId:number,routineIdx:number)=>
  {
    setIsTimePickerVisible(isOpene)
    setSelectedId(isfunId)
    setSelectExerciseId(routineIdx)
 
  }

 
  const passTheValue=(isOpene:boolean,duration:number)=>{
    setModal(isOpene);

    setDuration(duration);
    console.log("isoops"+isOpene)

  }
 
  
 
  useEffect(()=>{
  
    if (checkPersonal&&response) {
      const updatedResponse = response.map((exercise) => {
        const updatedSets = exercise.sets.map((set) => {
          const matchingSet = checkPersonal.find((personalSet) => personalSet.SetId === set.id);
          console.log(matchingSet)
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
<Modal visible={isOpen} animationType='slide' > 

<CountdownCircleTimer
  isPlaying
  duration={duration}
  colors={['#004777', '#F7B801', '#A30000', '#A30000']}
  colorsTime={[7, 5, 2, 0]}
 
>
  {({ remainingTime }) => 
{  if(remainingTime===0){
     
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
<Button title="Close" onPress={()=>{setModal(false)}} />
</Modal>
<Modal visible={istimePickerVisible} animationType='slide'>
<ExpoCountdown/>
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