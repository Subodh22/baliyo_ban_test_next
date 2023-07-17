import { View, Text } from 'react-native'
import React,{useLayoutEffect} from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import PersonalScreen from '../screens/PersonalScreen';
import MyExerciseScreen from '../screens/MyExerciseScreen';
import HeadScreen from '../screens/HeadScreen';
import {Icon } from '@rneui/themed';

export type TabParamList={
    Home: undefined;
    MyExercise:undefined;
    Personal:undefined;
}
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
const navigation = useNavigation();

useLayoutEffect(()=>
{
    navigation.setOptions({
        headerShown:false
    })
},[])
  return (
  <Tab.Navigator screenOptions={({route})=>({
      tabBarActiveTintColor:"black",
      tabBarInactiveTintColor:"gray",
      tabBarIcon :({focused,color,size})=>
      {
        if(route.name==="Home"){
          return(
            <Icon 
            name="home-filled"
            type='MaterialIcons'
            color={focused? "black":"gray"} />
          )
          
        }else if (route.name==="MyExercise"){
          return(
            <Icon 
            name="folder"
            type='MaterialIcons'
            color={focused ? "black" : "gray"}
            
            />
          )
        }
        else if (route.name === "Personal")
        {
          return (
          <Icon
          name='person'
          type='MaterialIcons'
          color={focused?"black":"gray"}

          />)
        }


      }
  })}>
    <Tab.Screen name="Home" component={HeadScreen}/>
    <Tab.Screen name="MyExercise" component={MyExerciseScreen}/>
    <Tab.Screen name="Personal" component={PersonalScreen}/>
  </Tab.Navigator>
  )
}

export default TabNavigator