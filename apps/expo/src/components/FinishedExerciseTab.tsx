import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { Button } from '@rneui/base'
import { trpc } from '../utils/trpc'
import { SafeAreaView } from 'react-native-safe-area-context'
import DoneForInsidePage from './DoneForInsidePage'
import { MyContext } from '../Navigator/RootNavigator'
import { useNavigation } from '@react-navigation/native'
import { ChallengeNavigationProp } from '../Navigator/Challenges'

const FinishedExerciseTab = (props:any) => {
    const navigaton = useNavigation<ChallengeNavigationProp>();
    const finishedExercise = trpc.post.finishSession.useMutation();
    const changeProgress = trpc.post.changeDayProgress.useMutation();
    const finishedTopic = trpc.post.finishTopicWorkout.useMutation(); 
    const [imageUrls,setImageUrls]=useState([]);
    const finishWork=()=>{
      props.setClosed(false)
            finishedExercise.mutate({
                sessiodId:props.sessionId

            })
if(props.pPId!==0)
     { let Cweek=props.currentWeek
      let CStatus=props.currentStatus
      console.log(Cweek+CStatus+" ddf"+props.pPId)
      if(props.currentWeek<props.planLength)
      {
         
        if(props.currentStatus<props.currentWeekLength-1)
        {
          CStatus+=1
        }else{
          CStatus=0
          Cweek +=1
        }

      }else{
        if(props.currentStatus<props.currentWeekLength)
        {
          CStatus+=1
        }else{
          console.log("Finished EVERYTHING")
        }
      }

       changeProgress.mutate({
        pPId:props.pPId,
        currentStatus:CStatus,
        currentWeek: Cweek

       })}}
    const context = useContext(MyContext)
    const whosName = (props.topicId).split('/')
    const topo = context.topicDonzo
    const topicLength=context.Topiclength
    const finishChallenges=()=>
    {
         
    if (!topo!.includes(whosName[1].toString())) {
      context.setTopicDonzo((prev: any) => [
          ...prev,
          whosName[1].toString()
      ]);
      topo.push(whosName[1].toString())
  }
 
         const stringTopicsList = topo.filter((item:any) => typeof item === 'string') as string[];
        // console.log(context.currentDay+1 ==context.DayLength? "finished":"bobo")
        console.log( console.log(context.currentDay,context.Daylength,(context.currentDay+1) ==context.DayLength? "finished":"bobo"))
        if(imageUrls.length>0){ 
      finishedTopic.mutateAsync({
        // currentChallengeStatus:(context.currentDay+1) ==context.Daylength? "finished":"bobo" ,
        currentChallengeStatus:topo.length >=topicLength? "finished":"bobo" ,
        ChallengeToDayStatusId:context.challengeStatus,
        newTopicsList:stringTopicsList,
        topicListStatus: topo.length >=topicLength? "same":"notsame",
      })
      props.setClosed(false)
      finishedExercise.mutate({
          sessiodId:props.sessionId

      })
      navigaton.pop(2);
    }
      else{
        alert("Please take a progress pic")
      }
    }

    
    
    console.log(whosName[0])
  return (
    <SafeAreaView className=' m-2 flex-1 justify-center'>
      <Text className='text-black text-[20px]  font-light tracking-tight'>Congratulation, you finished your exercise</Text>
      <TouchableOpacity className='h-[60px] mt-2 bg-yellow-300  justify-center items-center flex'  onPress={()=>
        {
          {whosName[0]=="challenges"?finishChallenges() : finishWork()}
        }}>
  <Text className='text-black text-[15px]  font-light tracking-tight'>Next</Text>
</TouchableOpacity>
<DoneForInsidePage topicId={props.topicId} setImageUrls={setImageUrls}/>
    </SafeAreaView>
  )
}

export default FinishedExerciseTab