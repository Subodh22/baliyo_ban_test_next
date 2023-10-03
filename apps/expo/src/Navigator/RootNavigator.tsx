import { View, Text } from 'react-native'
import React, { createContext, useState } from 'react'
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
import { Json } from 'aws-sdk/clients/marketplacecatalog';
import { Prisma } from '.prisma/client';
 
import ProofScreen from '../screens/ProofScreen';
 
 
const RootStack = createNativeStackNavigator();
 
export const MyContext = createContext<any>([]);

const RootNavigator = () => {
  const [challengeStatus, setchallengeStatus] = useState<any>(0);
  const [Topiclength, setTopiclength] = useState<number>(0);
  const [Daylength, setDaylength] = useState<number>(0);
  const [currentDay, setcurrentDay] = useState<number>(0);
  const [topicDonzo,setTopicDonzo] = useState<any[]>([]);
  return (
    <MyContext.Provider value={{currentDay, setcurrentDay,Daylength, setDaylength,topicDonzo,setTopicDonzo,challengeStatus, Topiclength, setTopiclength,setchallengeStatus}}>
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
        <RootStack.Screen name='ProofScreen' component={ProofScreen}/>
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
    </MyContext.Provider>
  )
}

export default RootNavigator