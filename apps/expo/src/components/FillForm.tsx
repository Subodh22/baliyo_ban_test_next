import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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
      if (step < 4) setStep(step + 1);
    };
  
    const prev = () => {
      if (step > 1) setStep(step - 1);
    };
  
   
  
    return (
      <View style={styles.container}>
        {step === 1 && (
          <>
            <Text style={styles.question}>How much do you weigh? (kg)</Text>
            <TextInput
          value={formData.weight}
          keyboardType="numeric" 
          onChangeText={(text) => setFormData({ ...formData, weight: text })}
          placeholder="Enter Weight"
        />
            <Button title="Next" onPress={() => next()} />
          </>
        )}
        {step === 2 && (
          <>
            <Text style={styles.question}>How tall are you?(cm)</Text>
            <TextInput
            keyboardType='numeric'
          value={formData.height}
          onChangeText={(text) => setFormData({ ...formData, height: text })}
          placeholder="Enter Height"
        />
            <Button title="Next" onPress={() => next()} />
          </>
        )}
        {step === 3 && (
          <>
            <Text style={styles.question}>What is your gender?</Text>
           <Picker
           selectedValue={formData.gender}
           onValueChange={(itemValue)=>setFormData({...formData,gender:itemValue})}
           >
            <Picker.Item label='male' value="male" />
            <Picker.Item label='female' value="female" />
           </Picker>
            <Button title='Next' onPress={()=>next()}/>
          </>
        )}
        {step === 4 && (
          <>
            <Text style={styles.question}>What's your experience level?</Text>
            <Picker
            selectedValue={formData.experience}
            onValueChange = {(itemValue)=>setFormData({...formData,experience:itemValue})}
            >
                <Picker.Item label='Beginner' value="Beginner"/>
                <Picker.Item label='Intermediate (1-3 years)' value="Intermediate"/>
                <Picker.Item label='Advanced (+4 years)' value="Advanced"/>

            </Picker>
             <Button title='Get Started' onPress={sendUserData}/>
          </>
        )}
  
        <View style={styles.buttons}>
          {step > 1 && <Button title="Previous" onPress={prev} />}
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingTop: 50, // added for spacing
    },
    question: {
      fontSize: 18,
      marginBottom: 20,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
  });

export default FillForm;