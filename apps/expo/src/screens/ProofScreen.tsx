import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RootStackParamList } from '../Navigator/RootNavigator';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ChallengeNavigationProp } from '../Navigator/Challenges';
import CameraComponent from '../components/CameraComponent';
import { trpc } from '../utils/trpc';
import FastImage from "react-native-fast-image"
import { SafeAreaView } from 'react-native-safe-area-context';
import Picture from './Picture';
import { Image, Slider } from 'react-native-elements';
// import Slider from '@react-native-community/slider';
const ProofScreen = () => {
  type CustomScreenRouteProp = RouteProp<RootStackParamList, "ProofScreen">;
  const navigator = useNavigation<ChallengeNavigationProp>()
  const {params:{topicType,proofType,input,topicId,daysId,challengesId,topicName}}=useRoute<CustomScreenRouteProp>()
  const {data,isLoading} = trpc.post.getProofs.useQuery({topicId:topicId});
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const downloadImages = trpc.post.getImagesFromFolder.useMutation();
const [cameraShow,setCameraShow]=useState(false);
const [loading, setLoading] = useState(true);    
const [textShow,settextShow] = useState(false)
const [currentImage,setCurrentImageUrl]=useState("")
const [showImage,setShowImage] = useState(false)
const [val,setVal]=useState<number>(0)
if(!isLoading){
    console.log(data+"nothing");
  }
   
  useEffect(() => {
     
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
  value={0}
  step={1}
  onValueChange={(value) => setVal(value)}
  minimumTrackTintColor="#FFFFFF"
  maximumTrackTintColor="#000000"
/>
<Text>{val}</Text>
</View>
}
      </View>
  )} 
  
  else if(proofType=="summary")
  {
    return(
      <View> 
 
     <SafeAreaView className='w-full h-full'>
      
      <TextInput
        style={{ height: 150, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        placeholder="Enter some text"
        multiline={true}
        numberOfLines={4}
      />
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