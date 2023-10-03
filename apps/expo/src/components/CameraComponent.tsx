import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { useEffect,useRef,useState } from 'react';
import {Camera,CameraCapturedPicture,CameraType } from 'expo-camera';
import {shareAsync} from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Button, Image } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '../utils/trpc';



const CameraComponent = (props:any) => {
 const cameraRef = useRef<Camera | null>(null);
 const [hasCameraPermission,setHasCameraPermission] = useState<boolean | undefined>(undefined);
 const [hasMediaLibraryPermission,setHasMediaLibraryPermission] = useState<boolean | undefined>(undefined);
 const [photo,setPhoto]=useState<CameraCapturedPicture|undefined>();
 const getPresignedUrlMutation = trpc.post.getPresignedForUploadImage.useMutation();
// const uploadPicToAws = trpc.post.uploadPic.useMutation();
 const [cameraType, setCameraType] = useState(CameraType.back);
  const [uploading,setUploading] = useState(false)
 const toggleCameraType = () => {
   setCameraType((prevType: any) => 
     prevType === CameraType.back ? CameraType.front : CameraType.back
   );
 };
 useEffect(()=>
 {
  (async()=>
  {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const MediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasCameraPermission(cameraPermission.status ==="granted");
    setHasMediaLibraryPermission(MediaLibraryPermission.status ==="granted")



  })();

 },[])
 const takePic = async () => {
  console.log("working");
  const options = {
    quality: 1,
    base64: true,
    exif: true,
  };

  const newPhoto = await cameraRef!.current!.takePictureAsync(options);
  setPhoto(newPhoto);
};

const sharepic = () => {
  if (photo) {
    shareAsync(photo.uri).then(() => {
      setPhoto(undefined);
    });
  }
};

const savePic = () => {
  if (photo) {
    MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
      setPhoto(undefined);
    });
  }
};
// const UploadPic = async() => {
//     if(photo&&photo.base64)
//     {
//         try{
//             const regex = new RegExp('[^A-Za-z0-9+/=]', 'g');
//             const cleanBase64 = photo.base64.replace(regex, '');
//             console.log(cleanBase64.length);
//             const partialBase64 = cleanBase64.substring(0, 100); 
//             const imageUrl = await uploadPicToAws.mutateAsync({image:partialBase64})
//             console.log("image uploaded to:",imageUrl)
//         }catch (error){
//             console.error("Failed to upload image",error)
//         }
//     }
//   };
  const UploadPic = async () => {
    
    setUploading(true)
    if (!photo) {
      console.error("No photo to upload");
      return;
    }
  
    // 1. Fetch the image data from the photo's URI
    const response = await fetch(photo.uri);
    const blob = await response.blob();
  
    // 2. Get the pre-signed URL from your tRPC procedure
    const result = await getPresignedUrlMutation.mutateAsync({ filename: `${Date.now()}.jpg` ,topicId:props.topicId.toString()});
    const presignedUrl:any = result.presignedUrl;
  
    // 3. Use the pre-signed URL to upload the image data to S3
    try {
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': 'image/jpeg'
        }
      });
  
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload to S3');
      }
  
      console.log('Successfully uploaded to S3');
    } catch (error) {
      console.error('Upload error:', error);
    } finally{
      setUploading(false)
      props.setCameraShow(false)
      props.setImageUrls((prev:any )=> [
        ...prev,
        `data:image/jpg;base64,${photo.base64}`
      ])
    }
  };

if (hasCameraPermission === undefined) {
  return <Text>Requesting permissions...</Text>;
} else if (!hasCameraPermission) {
  return <Text>Permission for camera not granted. Please change this in settings</Text>;
}

if (photo) {
  return (
    <SafeAreaView  className='w-full h-full'>
    <View style={{ flex: 1,  }}>
       
        <Image 
            className='h-full w-full'
            source={{ uri: `data:image/jpg;base64,${photo.base64}` }} 
        />
          <View  
           style={{ 
            position: 'absolute', 
            bottom: 20, 
            left: 0, 
            right: 0, 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: 10, }}>
            {hasMediaLibraryPermission ? <Button title="SavePic" onPress={savePic} /> : null}
            {/* <Button title="Upload" onPress={UploadPic} /> */}
            
              {uploading ? 
           <View className='bg-blue-200 w-[100px] h-[40px]'>
            <ActivityIndicator/> 
            </View>  :
            <Button title="Upload" onPress={UploadPic} />
            }
            
            <Button title="Discard" onPress={() => setPhoto(undefined)} />
        </View>
    </View>
</SafeAreaView>
  );
}

return (
  <SafeAreaView className='h-full w-full'> 
  <Camera type={cameraType} useCamera2Api={true}   ref={cameraRef}  style={{ flex: 1, width: '100%',  }}>
    <View  style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }} >
      <Button title="take Pic" onPress={takePic} />
      <Button title="Toggle Camera" onPress={toggleCameraType} />
    </View>
  </Camera>
  </SafeAreaView>
);
};

export default CameraComponent;