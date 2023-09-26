import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import YoutubeEm from '../components/YoutubeEm'
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect,useRef,useState } from 'react';
import {Camera,CameraCapturedPicture} from 'expo-camera';
import {shareAsync} from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Button, Image } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';



const Challenges = () => {
 let cameraRef = useRef<Camera | null>(null);
 const [hasCameraPermission,setHasCameraPermission] = useState<boolean | undefined>(undefined);
 const [hasMediaLibraryPermission,setHasMediaLibraryPermission] = useState<boolean | undefined>(undefined);
 const [photo,setPhoto]=useState<CameraCapturedPicture|undefined>();

 const [cameraType, setCameraType] = useState<number>(1);

 const toggleCameraType = () => {
  setCameraType((prevType) => 
    prevType === 1 ? 2 : 1
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
  let options = {
    quality: 1,
    base64: true,
    exif: true,
  };

  let newPhoto = await cameraRef!.current!.takePictureAsync(options);
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

if (hasCameraPermission === undefined) {
  return <Text>Requesting permissions...</Text>;
} else if (!hasCameraPermission) {
  return <Text>Permission for camera not granted. Please change this in settings</Text>;
}

if (photo) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image style={{ width: '100%', height: '100%' }} source={{ uri: `data:image/jpg;base64,${photo.base64}` }} />
      <Button title="Share" onPress={sharepic} />
      {hasMediaLibraryPermission ? <Button title="SavePic" onPress={savePic} /> : null}
      <Button title="Discard" onPress={() => setPhoto(undefined)} />
    </SafeAreaView>
  );
}

return (
  <Camera type={cameraType} ref={cameraRef} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <View>
      <Button title="take Pic" onPress={takePic} />
      <Button title="Toggle Camera" onPress={toggleCameraType} />
    </View>
  </Camera>
);
};

export default Challenges;