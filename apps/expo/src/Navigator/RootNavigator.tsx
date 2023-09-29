import { View, Text } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import TabNavigator from './TabNavigator';
import ModalScreen from '../screens/ModalScreen';
import SpecificScreen from '../screens/SpecificScreen';
import SpecificNavigator from './SpecificNavigator';
import InsidePage2 from './InsidePage2';
import PlanScreen from '../screens/PlanScreen';
import Challenges from './Challenges';
import Assingments from './Assingments';
import DayChallenge from '../screens/DayChallenge';
import TopicList from '../screens/ChallengeLists';
import ChallengeLists from '../screens/ChallengeLists';
import TopicWorkout from '../screens/TopicWorkout';
type set = {
  exerciseId:number,
  id:number,
  name:string,
  order:number,
  restTime:string,
  type:string,
  volume:string,
  weight:string
}
type exercises={
  id: number;
name: string;
type: string;
setType: string|null;
order: number;
routineId: number;
sets: set[];
}
type jue={
  id:number,
  weekRoutine:string,
  exercises:exercises[],
  order:number
  workoutCelebId:number
} 

export type RootStackParamList={
    Main:undefined;
    MyModal:{workoutId:number; name:string,ratings:string,planType:string};
    Specific:{WorkoutCelebId:number,orderP:number,id:number,name:string|undefined,planLength:number,planId:number|null,currentStatus:number,currentWeek:number};
    Custom:{exercises:exercises[]};
    PlanScreenT:{WorkoutCelebId:number,name:string|undefined};
    Assignments:{videoId:string};
    DayChallenge:{challengesId:number};
    TopicList:{daysId:number}
    TopicWorkout:{workoutId:number|null}
    ChallengeLists:{daysId:number}
    Inside:{routineId:number,pPId:number,nameOfDay:string,planLength:number,workoutCelebId:number,currentWeek:number,currentStatus:number,currentWeekLength:number};
} 
const RootStack = createNativeStackNavigator();


const RootNavigator = () => {
  return (
    <RootStack.Navigator>
       <RootStack.Group>
        <RootStack.Screen name="Main" component={TabNavigator}/>
       </RootStack.Group>

      
       <RootStack.Group 
       screenOptions={{
        presentation:"modal"
       }}>
        <RootStack.Screen options={{headerShown:false}} name="MyModal" component={ModalScreen}/>
       </RootStack.Group>
       <RootStack.Group>
        <RootStack.Screen name='PlanScreenT' component={PlanScreen}/>
       </RootStack.Group>
       <RootStack.Group>
        <RootStack.Screen name='TopicList' component={TopicList}/>
       </RootStack.Group>
       <RootStack.Group>
        <RootStack.Screen name='TopicWorkout' component={TopicWorkout}/>
       </RootStack.Group>
       <RootStack.Group>
        <RootStack.Screen name='ChallengeLists' component={ChallengeLists}/>
       </RootStack.Group>
       <RootStack.Group>
        <RootStack.Screen name='DayChallenge' component={DayChallenge}/>
       </RootStack.Group>
       <RootStack.Group>
        <RootStack.Screen name='Specific' component={SpecificNavigator}/>
       </RootStack.Group>
       <RootStack.Group>
        <RootStack.Screen name='Inside' component={InsidePage2}/>
       </RootStack.Group>
       <RootStack.Group>
        <RootStack.Screen name='Assignments' component={Assingments}/>
       </RootStack.Group>
       <RootStack.Group>
        <RootStack.Screen name='Challenges' component={Challenges}/>
       </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default RootNavigator