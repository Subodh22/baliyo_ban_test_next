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

export type TabParamList={
    Home: undefined;
    MyExercise:undefined;
    Personal:undefined;
}
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
const navigation = useNavigation();
const getUserData  = trpc.post.getUserData.useQuery();
 
useLayoutEffect(()=>
{
    navigation.setOptions({
        headerShown:false
    })
},[])
 
if (getUserData.data && getUserData.data.length > 0) {
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
                  }
              }
          })}
      >
          <Tab.Screen name="Home" component={HeadScreen} />
          <Tab.Screen name="MyExercise" component={MyExerciseScreen} />
          <Tab.Screen name="Personal" component={PersonalScreen} />
      </Tab.Navigator>
  );
} else {
  return  <FillForm />;
}
}

export default TabNavigator