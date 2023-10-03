import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
 
import { trpc } from '../utils/trpc';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MyContext } from '../Navigator/RootNavigator';
import { ChallengeNavigationProp } from '../Navigator/Challenges';
import { Prisma } from '.prisma/client';
import { Button } from 'react-native-elements';
import { RootStackParamList } from '../types/NavigationTypes';
 
type CustomScreenRouteProp = RouteProp<RootStackParamList, "ChallengeLists">;
const ChallengeLists = () => {
    const {params:{daysId,statusId,challengesId }}=useRoute<CustomScreenRouteProp>();
    const navigation = useNavigation<ChallengeNavigationProp>();
    const getTopicData = trpc.post.getTopicData.useQuery({daysId:daysId})
    const changeChallengeSetting =  trpc.post.updateTopicsDoneList.useMutation()
     
    // let topo:Prisma.JsonArray
    // const [topo, setTopiclist] = useState<Prisma.JsonArray>(Array.isArray(topicList) ? topicList : []);
    const context = useContext(MyContext);
    const topo = context.topicDonzo
    
    useEffect(()=>{
      context.setchallengeStatus(statusId)
      
      if (getTopicData["data"] && getTopicData["data"].length > 0) {
  
      
      context.setTopiclength(getTopicData["data"]?.length)
    }},[getTopicData["data"]])
  
    return ( 
    <View>
       
      <ScrollView> 
      {
    getTopicData["data"]?.map(({id,name,TopicType,proofType,WorkoutId,input})=>{
      const isIdInTopicsList = topo?.includes(id.toString());
       
        return(<TouchableOpacity key={id} onPress={()=>{
          if(!isIdInTopicsList)
     { 
     if(TopicType =="Workout" &&WorkoutId)
    { navigation.navigate('Specific', { topicId:id,name: name,WorkoutCelebId:WorkoutId,planLength:0 ,planId:null,id:0,currentStatus:0,currentWeek:0 ,orderP:0 }) }
      else   {
        navigation.navigate('ProofScreen',{statusId:statusId,proofType:proofType,topicId:id,daysId:daysId,challengesId:challengesId,topicName:name,input:input,topicType:TopicType})
      }
        
      }
        else{
          alert("Already Done")
        }
      }
    
    }
        > 
        <View className="h-24 m-3 bg-white  shadow flex-row justify-between items-center p-4">
        <Text className="text-black text-[20px]  font-light tracking-tight">
        {name}
    </Text>
   { isIdInTopicsList && <Text className="text-black text-[20px]  font-light tracking-tight">
        Done
    </Text>}
            
        </View>
    </TouchableOpacity>)
    }
         )
  }
      </ScrollView>

      
    </View>
  )
}

export default ChallengeLists