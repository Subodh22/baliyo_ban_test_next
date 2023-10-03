import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { MyContext  } from '../Navigator/RootNavigator';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { trpc } from '../utils/trpc';
import { ChallengeNavigationProp } from '../Navigator/Challenges';
import { Icon } from '@rneui/base';
import { Prisma } from '.prisma/client';
import { RootStackParamList } from '../types/NavigationTypes';
 
type CustomScreenRouteProp = RouteProp<RootStackParamList, "DayChallenge">;
const DayChallenge = () => {
    const {params:{challengesId}}=useRoute<CustomScreenRouteProp>();
    const navigation = useNavigation<ChallengeNavigationProp>();
    const getDayData = trpc.post.getDayData.useQuery({challengesId:challengesId})
    const context = useContext(MyContext)
    
    useEffect(()=>{
      if(getDayData.data?.getChallengeToDayStatue!.TopicsDoneList)
      {
        context.setTopicDonzo(getDayData.data?.getChallengeToDayStatue!.TopicsDoneList)
      }
      console.log(context.topicDonzo)
    },[getDayData.data])
  
   
const checkDay=(day:string)=>
{
  if(day=="done"){
    alert("This day is already done. Go to Today")
  }
  if(day=="locked"){
    alert("This day is locked. Go to Today")
  }
}
  if(getDayData.data?.getChallengeToDayStatue ==null)
  {
    console.log("boobmacalss")
  }
    return (
    <View>
    <Text>sdsdf</Text>
      <ScrollView> 
      {
    getDayData.data?.getdays?.map(({id,challengesId,name,order})=>
     {

     
      return(
        <TouchableOpacity key={id}  onPress={()=>{
         {getDayData.data?.getChallengeToDayStatue!.CurrentDayOrder>order? 
          checkDay("done")
          : getDayData.data?.getChallengeToDayStatue!.CurrentDayOrder==order? 
          navigation.navigate('ChallengeLists',{daysId:id,challengesId:challengesId,statusId:getDayData.data?.getChallengeToDayStatue!.id  }):
          checkDay("locked")
        
        }}}
          >
        <View className="h-24 m-3 bg-white  shadow flex-row justify-between items-center p-4">
        <Text className="text-black text-[20px]  font-light tracking-tight">
        {name}
    </Text>
    {getDayData.data?.getChallengeToDayStatue!.CurrentDayOrder>order?  <Text className='text-black text-[16px]  font-light tracking-tight'>Done</Text>:
          getDayData.data?.getChallengeToDayStatue!.CurrentDayOrder==order?<Text className='text-black text-[16px]  font-light tracking-tight'> Today</Text>:
          id!=0?<Icon name='lock' type='antdesign'/>:<></>}
        </View>

    </TouchableOpacity>
      )
         }
         
         )
  }
      </ScrollView>
    </View>
  )
}

export default DayChallenge