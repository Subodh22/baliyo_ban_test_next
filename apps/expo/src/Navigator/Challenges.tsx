import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import YoutubeEm from '../components/YoutubeEm'
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './RootNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect,useRef,useState } from 'react';
import {Camera,CameraCapturedPicture,CameraType } from 'expo-camera';
import {shareAsync} from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { Button, Image } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import CameraComponent from '../components/CameraComponent';



const Challenges = () => {
 
return (
 <CameraComponent/>
);
};

export default Challenges;