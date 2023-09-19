import { View, Text } from 'react-native'
import React,{useLayoutEffect} from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import PersonalScreen from '../screens/PersonalScreen';
import MyExerciseScreen from '../screens/MyExerciseScreen';
import HeadScreen from '../screens/HeadScreen';
import {Icon } from '@rneui/themed';
import { trpc } from '../utils/trpc';
import FillForm from '../components/FillForm';
import LoadingHead from '../screens/LoadingHead';

import MyCalendar from '../screens/MyCalendar';

export type TabParamList={
    Home: undefined;
    MyExercise:undefined;
    Personal:undefined;
    Calendar:undefined;
    Challenges:undefined;
}
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
const navigation = useNavigation();
const {data:getUserData,isLoading:isPosting}  = trpc.post.getUserData.useQuery();
 
useLayoutEffect(()=>
{
    navigation.setOptions({
        headerShown:false
    })
},[])
 
if(isPosting){
    return <LoadingHead/>
}
if (getUserData && getUserData.length > 0) {
  return (
      <Tab.Navigator
          screenOptions={({ route }) => ({
              tabBarActiveTintColor: 'black',
              tabBarInactiveTintColor: 'gray',
              tabBarIcon: ({ focused, color, size }) => {
                  if (route.name === 'Home') {
                      return (
                          <Icon
                              name="home-filled"
                              type="MaterialIcons"
                              color={focused ? 'black' : 'gray'}
                          />
                      );
                  } else if (route.name === 'MyExercise') {
                      return (
                          <Icon
                              name="folder"
                              type="MaterialIcons"
                              color={focused ? 'black' : 'gray'}
                          />
                      );
                  } else if (route.name === 'Personal') {
                      return (
                          <Icon
                              name="person"
                              type="MaterialIcons"
                              color={focused ? 'black' : 'gray'}
                          />
                      );
                  } else if (route.name === 'Calendar') {
                    return (
                        <Icon  name="event"  type="AntDesign"   color={focused ? 'black' : 'gray'} />
                    );
                }
//                 else if (route.name === 'Challenges') {
//                     return (
//                         <Icon
//   name='group'
//   type='font-awesome'
//   color={focused ? 'black' : 'gray'}
// />
//                         // <Icon  name="dumbbell"  type="fontawesome5"   color={focused ? 'black' : 'gray'} />
//                     );
//                 }
              }
          })}
      >
          <Tab.Screen name="Home" component={HeadScreen} />
          <Tab.Screen name="MyExercise" component={MyExerciseScreen} />
          {/* <Tab.Screen name="Challenges" component={PersonalScreen} /> */}
          <Tab.Screen name="Calendar" component={MyCalendar} />
          <Tab.Screen name="Personal" component={PersonalScreen} />
         
      </Tab.Navigator>
  );
} else {
  return  <FillForm />;
}
}

export default TabNavigator