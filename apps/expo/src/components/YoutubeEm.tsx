import { View, Text } from 'react-native'
import React from 'react'
import YoutubePlayer from "react-native-youtube-iframe";
 
const YoutubeEm = (props:any) => {
  return (
    <View className='pt-40'>
      {/* <WebView
      source={{uri:""}}
       /> */}
      <YoutubePlayer
     webViewProps={{
      onShouldStartLoadWithRequest: () => {
            return true;  
      },
  }}
        height={500}
        width={400}
        play={false}
        videoId={props.videoId}
        
      />
</View>
  )
}

export default YoutubeEm