import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
const LoadingHead = () => {
  return (
    <View className='flex-1 justify-center items-center'>
      <ActivityIndicator size="large" />
      <Text className='mt-4 text-black text-[15px]  font-light tracking-tight'>
        Loading...
      </Text>
    </View>
  )
}

export default LoadingHead