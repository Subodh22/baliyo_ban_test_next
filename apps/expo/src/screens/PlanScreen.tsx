import { View, Text } from 'react-native'
import React from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Navigator/RootNavigator';

type PlanScreenRouteProp = RouteProp<RootStackParamList, "PlanScreenT">;
const PlanScreen = () => {
     
    const { params: { WorkoutCelebId: workoutCelebId, name } } = useRoute<PlanScreenRouteProp>()
    
  return (
    <View>
     
    </View>
  )
}

export default PlanScreen