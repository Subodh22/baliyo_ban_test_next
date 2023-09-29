import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
 
import { trpc } from '../utils/trpc';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../Navigator/RootNavigator';
import { ChallengeNavigationProp } from '../Navigator/Challenges';
 
type CustomScreenRouteProp = RouteProp<RootStackParamList, "ChallengeLists">;
const ChallengeLists = () => {
    const {params:{daysId}}=useRoute<CustomScreenRouteProp>();
    const navigation = useNavigation<ChallengeNavigationProp>();
    const getTopicData = trpc.post.getTopicData.useQuery({daysId:daysId})
 
  
    return ( 
    <View>
       
      <ScrollView> 
      {
    getTopicData["data"]?.map(({id,name,TopicType,proofType,WorkoutId})=>(
     
        <TouchableOpacity key={id} onPress={()=>{
          
     {TopicType =="Workout" &&WorkoutId?navigation.navigate('Specific', { name: name,WorkoutCelebId:WorkoutId,planLength:0 ,planId:null,id:0,currentStatus:0,currentWeek:0 ,orderP:0 }) 
        :""
        }
      }}
        > 
        <View className="h-24 m-3 bg-white  shadow flex-row justify-between items-center p-4">
        <Text className="text-black text-[20px]  font-light tracking-tight">
        {name}
    </Text>
            
        </View>
    </TouchableOpacity>
         ))
  }
      </ScrollView>
    </View>
  )
}

export default ChallengeLists