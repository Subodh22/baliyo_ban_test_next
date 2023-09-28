import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { RootStackParamList } from '../Navigator/RootNavigator';
import { RouteProp, useRoute } from '@react-navigation/native';
import { trpc } from '../utils/trpc';
 
type CustomScreenRouteProp = RouteProp<RootStackParamList, "TopicList">;
const TopicList = () => {
    const {params:{daysId}}=useRoute<CustomScreenRouteProp>();
    const getTopicData = trpc.post.getTopicData.useQuery({daysId:daysId})
 
  
    return (
    <View>
       
      <ScrollView> 
      {
    getTopicData["data"]?.map(({id,name})=>(
     
        <TouchableOpacity key={id} onPress={}  >
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

export default TopicList