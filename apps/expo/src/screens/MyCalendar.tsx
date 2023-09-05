import { View, Text, ScrollView, RefreshControl, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {Calendar}from 'react-native-calendars'
import { trpc } from '../utils/trpc';

interface MarkedType {
  [key:string]:{
    color:string,
    id:number,
    textColor:string,
    note:string,

  }
}

const CustomDayComponent = ({ date, state, marking }:any) => {
  const containerClass = `${marking?.note ? "bg-yellow-300" : ""} flex-1 h-[40px] w-[40px] items-center justify-center`;
  return (
    <View className={containerClass}
      >
      <Text>{date.day}</Text>
      {marking && marking.note && <Text >{marking.note}</Text>}
    </View>
  );
};
const MyCalendar = () => {
  const [selected, setSelected] = useState('');
  const [refreshing,setRefreshing]=useState(false)
  const {data:session,isLoading:isPosting,refetch} = trpc.post.getTheFinishedSession.useQuery({userId:"fill"})
  const [marked,setMarked] = useState({});
  useEffect(() => {
    if (session) {
      const newMarked: MarkedType = {};
      session.map((x) => {
        const formattedDate = `${x.FinsihedAt.getFullYear()}-${String(x.FinsihedAt.getMonth() + 1).padStart(2, '0')}-${String(x.FinsihedAt.getDate()).padStart(2, '0')}`;
        newMarked[formattedDate] = {
          color: '#fff178',
          textColor: 'black',
          id: x.id,
          note: x.RoutineName
        };
      });
      setMarked(newMarked);
    }
  }, [session]);
  const onRefresh = useCallback(() => {
   setRefreshing(true);
   refetch()
     .then(() =>
     {console.log(session)
     setRefreshing(false)
     
    }
     
     )
     .catch((error) => {
       console.error('Error refreshing data:', error);
       setRefreshing(false);
     });
 }, [refetch]);
   
 
  return (
    <ScrollView 
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
    }
    >
       <Calendar
        dayComponent={({ date, state, marking }) => (
          <CustomDayComponent date={date} state={state} marking={marking} />
        )}
        markingType={'period'}
       theme={{
        backgroundColor: '#ffffff',
        monthTextColor: 'black',
        calendarBackground: '#ffffff',
        arrowColor: 'black',
        textSectionTitleColor: '#b6c1cd',
        textSectionTitleDisabledColor: '#d9e1e8',
        selectedDayBackgroundColor: '#fff178',
        selectedDayTextColor: 'black',
        todayTextColor: 'black',
        dayTextColor: 'black',
        dotColor: '#fff178',
        selectedDotColor: '#ffffff',
         
       
       
      }}
      onDayPress={day => {
        setSelected(day.dateString);

        console.log(marked)
      }}
      markedDates={marked}
    />
    
    </ScrollView>
  )
}

export default MyCalendar