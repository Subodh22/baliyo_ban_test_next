import React, { useEffect } from 'react';
import { BackHandler, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/base';
import { Text } from 'react-native-elements';
 
const BackHandlerbe = (props:any) => {
  const navigation = useNavigation()
   
  const handleBackPress = () => {
    if(props.sessionId==true)
    {Alert.alert(
      'Confirm',
      'Do you really want to go back?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Yes, go back',
          onPress: () => navigation.goBack()
        }
      ]
    );}
    else{
      navigation.goBack()
    }
  };

  return (
    <TouchableOpacity onPress={handleBackPress}>
     <Text>Go back</Text>
      </TouchableOpacity>
  
  );}
 

export default BackHandlerbe