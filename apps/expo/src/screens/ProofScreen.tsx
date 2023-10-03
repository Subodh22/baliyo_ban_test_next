import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, FlatList, ActivityIndicator, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { RootStackParamList } from '../types/NavigationTypes';
 
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ChallengeNavigationProp } from '../Navigator/Challenges';
import CameraComponent from '../components/CameraComponent';
import { trpc } from '../utils/trpc';
import FastImage from "react-native-fast-image"
import { SafeAreaView } from 'react-native-safe-area-context';
import Picture from './Picture';
import { Button, Image, Slider } from 'react-native-elements';
import { Prisma } from '.prisma/client';
import { MyContext } from '../Navigator/RootNavigator';
// import Slider from '@react-native-community/slider';
const ProofScreen = () => {
  type CustomScreenRouteProp = RouteProp<RootStackParamList, "ProofScreen">;
  const navigator = useNavigation<ChallengeNavigationProp>()
  const {params:{topicType,proofType,input,topicId,statusId,daysId,challengesId,topicName}}=useRoute<CustomScreenRouteProp>()
   
  const [imageUrls, setImageUrls] = useState<string[]>([]);
const [cameraShow,setCameraShow]=useState(false);
const [loading, setLoading] = useState(true);    
const [textShow,settextShow] = useState(false)
const [currentImage,setCurrentImageUrl]=useState("")
const [showImage,setShowImage] = useState(false)
const [val,setVal]=useState<number>(0)
const[summaryVal,setSummaryVal]= useState<string>("")
// let topo:Prisma.JsonArray
// if (topicDoneList && Array.isArray(topicDoneList) ) {topo=topicDoneList}
const context = useContext(MyContext);
const topo = context.topicDonzo;

const GetProofs = trpc.post.getProofs.useQuery({topicId:topicId});
const downloadImages = trpc.post.getImagesFromFolder.useMutation();
 const AddProof = trpc.post.finishedTopic.useMutation();
const TopicProgress = trpc.post.updateProgress.useMutation();
  useEffect(() => {
 console.log(GetProofs.data)
    async function fetchImages() {
      try {
        const result = await downloadImages.mutateAsync({ folder: topicId.toString() }); // or omit folder to get all images
        if (result && Array.isArray(result)) {
          setImageUrls(result);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }finally {
        setLoading(false);
      }
    }

    fetchImages();
    
   
  }, []);
  useEffect(()=>{
    if(GetProofs.data?.FinsihedInput)
{setVal(GetProofs.data?.FinsihedInput)}
  },[GetProofs.data])

  const saveTopic=()=>
  {
    if(input!==val)
   { TopicProgress.mutateAsync({
   
      topicId:topicId,
      daysId:daysId,
      challengesId:challengesId,
      finishedInput:input?val:null,
      summary:summaryVal !==""?summaryVal:null,
    }) 
      navigator.goBack()
    
    
  }
    else{
      doneTopic()
    }
    
  }
  const inputCheck=()=>
  {
  
    if(imageUrls.length>=2 && (input? input ==val:true)){
    
       doneTopic()
    }
    else{
      Alert.alert(
        'Confirm',
        imageUrls.length<=2?"Upload atleast 2 images":"Finish the assignments",
        [
          {
            text: 'Ok',
            style: 'cancel'
          }
         
        ]
      )
    }
  }

  const doneTopic=()=>
  {
     
    
       
      
    if (!topo!.includes(topicId.toString())) {
      context.setTopicDonzo((prev: any) => [
          ...prev,
          topicId.toString()
      ]);
      topo.push(topicId.toString())
  }
 
         const stringTopicsList = topo.filter((item:any) => typeof item === 'string') as string[];
      AddProof.mutateAsync({
       challengeToDayStatusId:statusId,
      newTopicsList:stringTopicsList,
      topicId:topicId,
      daysId:daysId,
      challengesId:challengesId,
      finishedInput:input?val:null,
      summary:summaryVal !==""?summaryVal:null,
      }) 

      navigator.goBack()
      
    
  }
  const checks =()=>
  {
     
    if(proofType=="pic")
    {
      if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
      }
      return(
  <View > 
  <Modal visible ={showImage} >
  <TouchableOpacity  style={{ 
             position: 'absolute',
             zIndex: 10, // Bring the button to the front
             top: 40,
            left: 0, 
             
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: 10, }} onPress={()=>
        {
           setShowImage(false)
        }}> 
      <Text className='bg-yellow-300 h-[50px] w-[100px] '>Gp back</Text></TouchableOpacity>
    <Image className='w-full h-full' source={{uri:currentImage}}/>
  </Modal>
  <ScrollView horizontal={true}  className='h-[300px]'> 
{imageUrls.map((item,index)=>

  
  <TouchableOpacity className='h-[40px] w-[100px] bg-yellow-300 justify-center ' key={index} onPress={
    ()=>{  
      setShowImage(true)
      setCurrentImageUrl(item)} 
    }>
      <Text>photo {index+1}</Text>
    </TouchableOpacity>


)}
  
    </ScrollView>
      
<Picture   cameraShow={cameraShow} setCameraShow={setCameraShow} topicId={topicId} setImageUrls={setImageUrls}/>
{input && <View>
   <Slider
  style={{width: 200, height: 40}}
  minimumValue={0}
  maximumValue={input||0}
  value={val}
  step={1}
  onValueChange={(value) => setVal(value)}
  minimumTrackTintColor="#FFFFFF"
  maximumTrackTintColor="#000000"
/>
<Text>{val}</Text>
 
  
</View>
}
<TouchableOpacity className='bg-yellow-300 h-[30px] w-[100px]'
 onPress={()=>{
  if(input!==null){
    saveTopic()
  }else{
    navigator.goBack()
  }
  
  }}>
    <Text>Save</Text>
   </TouchableOpacity>
<TouchableOpacity className='bg-yellow-300 h-[30px] w-[100px]' onPress={inputCheck}>
    <Text>Finished Exercise</Text>
   </TouchableOpacity>
  
      </View>
  )} 
  
  else if(proofType=="summary")
  {
    return(
      <View> 
 
     <SafeAreaView className='w-full h-full'>
    {summaryVal !=="" ?<Text>{GetProofs.data?.summary}</Text>:<></>}
      <TextInput
        style={{ height: 150, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        placeholder="Enter some text"
        multiline={true}
        numberOfLines={4}
        value={summaryVal}
        onChangeText={(value)=>{setSummaryVal(value)}}
      />
      


      <Button title="Save" onPress={()=>
        {
          Keyboard.dismiss
          if(summaryVal!=="")
       {   doneTopic()}else{

        alert("Summarize 10 pages")
       }
        }}/>
      </SafeAreaView> 
 
   
          
          </View>)
  }

  
  }
   
  return (
  

    <View className='h-full w-full  '>
      <Text>{topicName}</Text>
      <Text>{proofType}</Text>  
     {checks()}  
   
    </View>
  )
}

export default ProofScreen