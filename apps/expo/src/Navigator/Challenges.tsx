import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import YoutubeEm from '../components/YoutubeEm'
import { CompositeNavigationProp,RouteProp,  useNavigation } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabParamList } from '../Navigator/TabNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
// import { RootStackParamList } from '../Navigator/RootNavigator'
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraComponent from '../components/CameraComponent';
import ChallengesHeadScreen from '../components/ChallengesHeadScreen';
import { trpc } from '../utils/trpc';
import { RootStackParamList } from '../types/NavigationTypes'
export type ChallengeNavigationProp=CompositeNavigationProp<BottomTabNavigationProp<TabParamList,"Challenges">,
NativeStackNavigationProp<RootStackParamList>>;

const Challenges = () => {
    const navigation = useNavigation<ChallengeNavigationProp>();
    const getData = trpc.post.getChallenges.useQuery()
    const getChallenge = trpc.post.getUsersChallenge.useQuery()
return (<SafeAreaView>
      <Text className="text-black text-[20px]  font-light tracking-tight">
       Challenges
    </Text>
    <ScrollView horizontal={true}>
   
    {
    getData["data"]?.map(({id,name})=>(
     <ChallengesHeadScreen key={id} challengeid={id} name={name} />
         ))
  }

    </ScrollView>
    <ScrollView>
    {
    getChallenge["data"]?.map(({id,challengesId,challengeName})=>(
     
        <TouchableOpacity key={id} onPress={ ()=>{navigation.navigate('DayChallenge',{challengesId:challengesId})} } >
        <View className="h-24 m-3 bg-white  shadow flex-row justify-between items-center p-4">
        <Text className="text-black text-[20px]  font-light tracking-tight">
        {challengeName}
    </Text>
            
        </View>
    </TouchableOpacity>
         ))
  }
    </ScrollView>
    
    </SafeAreaView>
);
};

export default Challenges;