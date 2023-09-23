import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import YoutubeEm from '../components/YoutubeEm'
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Challenges = () => {
 
  type InsidenProp = NativeStackNavigationProp<RootStackParamList, 'Assignments'>;
  const navigation = useNavigation<InsidenProp> ();

  return (
    <View>
    <YoutubeEm videoId='cljg2ze1E3c'/> 
    <TouchableOpacity onPress={()=>{navigation.navigate('Assignments',{videoId:'cljg2ze1E3c'})}} className='w-[100px] h-[50px] bg-yellow-300'>
      <Text>Open</Text>
    </TouchableOpacity>
    </View>
  )
}

export default Challenges