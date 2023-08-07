import { View, Text } from 'react-native'
import React from 'react'
import YoutubePlayer from "react-native-youtube-iframe";
import WebView from "react-native-webview"
const YoutubeEm = (props:any) => {
  return (
    <View className='pt-40'>
      {/* <WebView
      source={{uri:""}}
       /> */}
      <YoutubePlayer
      
        height={500}
        width={400}
        play={false}
        videoId={props.videoId}
        
      />
</View>
  )
}

export default YoutubeEm