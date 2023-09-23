import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { trpc } from '../utils/trpc';
const FillForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      weight: '',
      height: '',
      gender: 'male',
      experience: 'Beginner',
    });
    const mutation=trpc.post.addUserData.useMutation();
   const userDataQuery = trpc.post.getUserData.useQuery();
 
   const sendUserData = () => {
    
    
    mutation.mutate(formData, {
        onSuccess: () => {
            // Refetch the query after mutation succeeds.
            userDataQuery.refetch();
        }
    });

};
    
    const next = () => {
  switch(step) {
    case 1:
      if (formData.weight === '') {
        alert('Please enter your weight.');
        return;
      }
      break;
    case 2:
      if (formData.height === '') {
        alert('Please enter your height.');
        return;
      }
      break;
    case 3:
      if (formData.gender === '') {
        alert('Please select your gender.');
        return;
      }
      break;
  }
  if (step < 4) setStep(step + 1);
 
    };
  
    const prev = () => {
      if (step > 1) setStep(step - 1);
    };
  
   
  
    return (
      <View style={styles.container}>
        {step === 1 && (
          <>
          <View className='flex-row mb-5'> 
            <Text className='text-black text-[20px]  font-light tracking-tight'>How much do you </Text>
            <Text className='text-black text-[20px] bg-yellow-300  font-light tracking-tight'>weigh</Text>
            <Text className='text-black text-[20px]  font-light tracking-tight'> ?(kg)</Text>
            </View>
            <TextInput
          value={formData.weight}
          keyboardType="numeric" 
          style={{fontSize:15  }}
          onChangeText={(text) => setFormData({ ...formData, weight: text })}
          placeholder="Enter Weight"
        />
      <TouchableOpacity className='h-[50px] mt-12 bg-yellow-300  justify-center items-center flex' onPress={() => next()} >
        <Text className='text-black text-[17px]  font-light tracking-tight'>Next</Text>
      </TouchableOpacity>
         
          </>
        )}
        {step === 2 && (
          <>
            <View className='flex-row mb-5'> 
            <Text className='text-black text-[20px]  font-light tracking-tight'>What is your </Text>
            <Text className='text-black text-[20px] bg-yellow-300  font-light tracking-tight'>height</Text>
            <Text className='text-black text-[20px]  font-light tracking-tight'> ?(cm)</Text>
            </View>
          
            <TextInput
            keyboardType='numeric'
          value={formData.height}
          style={{fontSize:15  }}
          onChangeText={(text) => setFormData({ ...formData, height: text })}
          placeholder="Enter Height"
        />
            
            <TouchableOpacity className='h-[50px] mt-12 bg-yellow-300  justify-center items-center flex' onPress={() => next()} >
        <Text className='text-black text-[17px]  font-light tracking-tight'>Next</Text>
      </TouchableOpacity>
          </>
        )}
        {step === 3 && (
          <>
            
            <View className='flex-row mb-5'> 
            <Text className='text-black text-[20px]  font-light tracking-tight'>What is your </Text>
            <Text className='text-black text-[20px] bg-yellow-300  font-light tracking-tight'>gender</Text>
            <Text className='text-black text-[20px]  font-light tracking-tight'> ?</Text>
            </View>
           
           <Picker
           style={{width:'100%', height:200}}
           selectedValue={formData.gender}
           onValueChange={(itemValue)=>setFormData({...formData,gender:itemValue})}
           >
            <Picker.Item label='male' value="male" />
            <Picker.Item label='female' value="female" />
           </Picker>
           <TouchableOpacity className='h-[50px] mt-12 bg-yellow-300  justify-center items-center flex' onPress={() => next()} >
        <Text className='text-black text-[17px]  font-light tracking-tight'>Next</Text>
      </TouchableOpacity>
          </>
        )}
        {step === 4 && (
          <>
            <View className='flex-row mb-5'> 
            <Text className='text-black text-[20px]  font-light tracking-tight'>What is your </Text>
            <Text className='text-black text-[20px] bg-yellow-300  font-light tracking-tight'>experience</Text>
            <Text className='text-black text-[20px]  font-light tracking-tight'> level?</Text>
            </View>
            
            <Picker
             style={{width:'100%', height:200}}
            selectedValue={formData.experience}
            onValueChange = {(itemValue)=>setFormData({...formData,experience:itemValue})}
            >
                <Picker.Item label='Beginner' value="Beginner"/>
                <Picker.Item label='Intermediate (1-3 years)' value="Intermediate"/>
                <Picker.Item label='Advanced (+4 years)' value="Advanced"/>

            </Picker>
            <TouchableOpacity className='h-[50px] mt-12 bg-yellow-300  justify-center items-center flex' onPress={sendUserData} >
        <Text className='text-black text-[17px]  font-light tracking-tight'>Next</Text>
      </TouchableOpacity>
           
          </>
        )}
  
        <View >
          {step > 1 &&
            <TouchableOpacity className='h-[50px] mt-6 w-auto p-2 bg-yellow-300  justify-center items-center flex'onPress={prev} >
            <Text className='text-black text-[17px]  font-light tracking-tight'>Previous</Text>
          </TouchableOpacity>
          }
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
       // added for spacing
    },
    question: {
      fontSize: 18,
      marginBottom: 20,
    },
 
  });

export default FillForm;