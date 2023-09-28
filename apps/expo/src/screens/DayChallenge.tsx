import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { RootStackParamList } from '../Navigator/RootNavigator';
import { RouteProp, useRoute } from '@react-navigation/native';
import { trpc } from '../utils/trpc';
 
type CustomScreenRouteProp = RouteProp<RootStackParamList, "DayChallenge">;
const DayChallenge = () => {
    const {params:{challengesId}}=useRoute<CustomScreenRouteProp>();
    const getDayData = trpc.post.getDayData.useQuery({challengesId:challengesId})
 
  
    return (
    <View>
      <Text>{challengesId} popo</Text>
      <ScrollView> 
      {
    getDayData["data"]?.map(({id,challengesId,name})=>(
     
        <TouchableOpacity key={id}  >
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

export default DayChallenge