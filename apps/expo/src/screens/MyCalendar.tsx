import { View, Text, ScrollView, RefreshControl, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {Calendar,Agenda}from 'react-native-calendars'
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
  //   <Agenda
  //   items={{
  //     '2023-09-01': [{ text: 'Today: Back' }],
  //     '2023-09-02': [{ text: 'Today: Back' }],
  //     '2023-09-03': [{ text: 'Today: Back' }],
  //     '2023-09-04': [{ text: 'Today: Back' }],
  //     '2023-09-05': [{ text: 'Today: Back' }],
  //     '2023-09-06': [{ text: 'Today: Back' }],
  //     '2023-09-07': [{ text: 'Today: Back' }],
  //     '2023-09-08': [{ text: 'Today: Back' }],
  //     '2023-09-09': [{ text: 'Today: Back' }],
  //     '2023-09-10': [{ text: 'Today: Back' }],
  //     '2023-09-11': [{ text: 'Today: Back' }],
  //     '2023-09-12': [{ text: 'Today: Back' }],
     
  //   }}
  //   theme={{
  //         backgroundColor: '#ffffff',
  //         monthTextColor: 'black',
  //         calendarBackground: '#ffffff',
  //         arrowColor: 'black',
  //         textSectionTitleColor: '#b6c1cd',
  //         textSectionTitleDisabledColor: '#d9e1e8',
  //         selectedDayBackgroundColor: '#fff178',
  //         selectedDayTextColor: 'black',
  //         todayTextColor: 'black',
  //         dayTextColor: 'black',
  //         dotColor: '#fff178',
  //         selectedDotColor: '#ffffff',
           
         
         
  //       }}
  //   renderItem={(item) => {
  //     return (
  //       <View style={{ backgroundColor: 'white', padding: 10, marginRight: 10, marginTop: 17 }}>
  //         <TouchableOpacity>
  //           <Text>{item.text}</Text> 
  //           </TouchableOpacity>
  //       </View>
  //     );
  //   }}
  // />
    )
}

export default MyCalendar