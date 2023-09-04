import { View, Text } from 'react-native'
import React from 'react'
import YoutubePlayer from "react-native-youtube-iframe";
import { Dimensions } from 'react-native';
const YoutubeEm = (props:any) => {
  console.log("Running video again")
  const screenWidth = Dimensions.get('window').width;
  return (
    <View className='pt-5  w-full'>
      {/* <WebView
      source={{uri:""}}
       /> */}
      <YoutubePlayer
     webViewProps={{
      onShouldStartLoadWithRequest: () => {
            return true;  
      },
  }}
        height={250}
        play={false}
        videoId={props.videoId}
        
      />
</View>
  )
}

export default YoutubeEm