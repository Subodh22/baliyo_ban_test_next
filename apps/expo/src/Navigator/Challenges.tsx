import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect } from 'react'
import YoutubeEm from '../components/YoutubeEm'
import { CompositeNavigationProp,RouteProp,  useNavigation, useRoute } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabParamList } from '../Navigator/TabNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
// import { RootStackParamList } from '../Navigator/RootNavigator'
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraComponent from '../components/CameraComponent';
import ChallengesHeadScreen from '../components/ChallengesHeadScreen';
import { trpc } from '../utils/trpc';
import { RootStackParamList } from '../types/NavigationTypes'
import { useIsFocused } from '@react-navigation/native';
import { MyContext } from './RootNavigator'
export type ChallengeNavigationProp=CompositeNavigationProp<BottomTabNavigationProp<TabParamList,"Challenges">,
NativeStackNavigationProp<RootStackParamList>>;

type Challenge = {
    id: number;
    challengesId: number;
    challengeName: string;
    active: string;
  };
  
const Challenges = () => {
    const navigation = useNavigation<ChallengeNavigationProp>();
   
    const getData = trpc.post.getChallenges.useQuery()
    const context = useContext(MyContext)
    const {data:getChallenge,isLoading,refetch} = trpc.post.getUsersChallenge.useQuery()
    const challengeStatus = trpc.post.addChallengesToUser.useMutation();
    
   
    useEffect(()=>{
        if(getData.data?.getUserDetails)
        {
            context.setExpoPushToken(getData.data?.getUserDetails.expoPushToken)
            console.log(getData.data?.getUserDetails,context.expoPushToken)
        }
    },[getData.data?.getUserDetails])
    useEffect(()=>{
        console.log(context.refreshChallenge)
        refetch()
    },[])


return (<SafeAreaView>
      <Text className="text-black text-[20px]  font-light tracking-tight">
       Challenges
    </Text>
    <ScrollView horizontal={true}>
   
    {
    getChallenge && getData["data"]?.getd?.map(({id,name})=>{
         
        const alreadyAdded = getChallenge?.some(x => x!.challengesId === id) || false;
        return( 
        <ChallengesHeadScreen key={id} refetch={refetch} challengeStatus={challengeStatus} userChallenge={getChallenge?.length} challengeid={id} name={name} alreadyAdded={alreadyAdded} />)
         })
  }

    </ScrollView>
    <ScrollView>
    {
    getChallenge?.map(({id,challengesId,challengeName,active}:Challenge)=>(
     
        <TouchableOpacity key={id} onPress={ ()=>{
            context.setActiveStatusChallenge(active)
            navigation.navigate('DayChallenge',{challengesId:challengesId})} } >
        <View className="h-24 m-3 bg-white  shadow flex-row justify-between items-center p-4">
        <Text className="text-black text-[20px]  font-light tracking-tight">
        {challengeName}
    </Text>
        <Text>{active=="active"?"Active Challenge":"Inactive"}</Text>
            
        </View>
    </TouchableOpacity>
         ))
  }
    </ScrollView>
    
    </SafeAreaView>
);
};

export default Challenges;