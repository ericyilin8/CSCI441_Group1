import { Alert, Pressable, TextInput, View, StyleSheet, Text, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Link, router } from "expo-router";
import React, { useState, useContext } from 'react';
import { Entypo } from '@expo/vector-icons';
import userService from '../services/userService';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }
    try {
      const user = await userService.register(username, email, password, phoneNumber);
      console.log('Registration response:', user);
      Alert.alert('Registration Successful', 'You may now log in');
      router.back();
    } catch (error) {
      console.error('Registration error: error');
      Alert.alert('Error', 'Something went wrong while registering');
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps='handled' // Closes keyboard when tapping outside of TextInput
      >
        <View style={styles.innerContainer}>
          <Link href="/" asChild>
            <Entypo name="back" size={36} color="white" />
          </Link>
          <Text style={styles.header}>REGISTER</Text>
          <TextInput
            value={username}
            onChangeText={(usernameIn) => setUsername(usernameIn)}
            placeholder={'Username'}
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText = {(emailIn) => setEmail(emailIn)}
            placeholder={'Email'}
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={(passwordIn) => setPassword(passwordIn)}
            placeholder={'Password'}
            secureTextEntry={true}
            style={styles.input}
          />
          <TextInput
            value={confirmPassword}
            onChangeText={(passwordIn) => setConfirmPassword(passwordIn)}
            placeholder={'Confirm Password'}
            secureTextEntry={true}
            style={styles.input}
          />
          <TextInput
            value={phoneNumber}
            onChangeText={(phoneNumberIn) => setPhoneNumber(phoneNumberIn)}
            placeholder={'Phone Number'}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <Pressable style={styles.createAccountButton} onPress={handleRegister}>
            <Text style={styles.createAccountButtonText}>CREATE ACCOUNT</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1, // centers content when it doesn't fill the screen
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
  },
  header: {
    color: 'white',
    fontSize: 48,
    marginBottom: 12
  },
  createAccountButton: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#F2F2F2',
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  createAccountButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
});
