import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, TextInput, View, StyleSheet, Text, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Link, router } from "expo-router";
import { useState, useContext, useEffect } from 'react';
import userService from '../services/userService';
import io from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { AppStateContext } from '../contexts/AppState';
import { RouterContext } from '../contexts/RouterContext';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setCurrentGroup } = useContext(AppStateContext);
  const { socket, setSocket } = useContext(AppStateContext);
  const { loading } = useContext(RouterContext);

  useEffect(() =>  {
    if (socket && !loading && isLoggedIn) {
      router.replace('map');
    }
  }, [socket, loading, isLoggedIn]);

  const onLogin = async () => {
    try {
      // Perform some basic validation before making the login request
      if (!username || !password) {
        Alert.alert('Error', 'Please enter both username and password.');
        return;
      }

      // Call the login function from the userService
      const data = await userService.login(username, password);

      //Put some data into the state
      setCurrentGroup(data.user.currentGroup);

      //Put some data into secure storage
      await SecureStore.setItemAsync('userToken', data.token);

      // Handle the successful login response here
      console.log('Login successful:', data);
    
      // Set socketContext to token
      const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
        query: {
          token: data.token
        }
      });

      socket.on('connect', () => {
        setSocket(socket);
        setIsLoggedIn(true);
      });

      socket.on('connect_error', (err) => {
        console.error('Connection failed:', err);
        Alert.alert('Error', 'Connection failed. Server may be unavailable.');
      });

    } catch (error) {
      // Handle login error here
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  if (!isLoggedIn) {
    // Socket isn't connected, prompt user for login or registration
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.innerContainer}>
            <Text style={styles.header}>LOGIN</Text>
            <TextInput
                value={username}
                onChangeText={(userIn) => setUsername(userIn)}
                placeholder={'Username'}
                style={styles.input}
              />
              <TextInput
                value={password}
                onChangeText={(passwordIn) => setPassword(passwordIn)}
                placeholder={'Password'}
                secureTextEntry={true}
                style={styles.input}
              />

              <Pressable onPress={onLogin} style={styles.button}>
                <Text style={styles.buttonText}>LOGIN</Text>
              </Pressable>

              <Link href="/register" asChild>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>REGISTER</Text>
                </Pressable>
              </Link>
            <StatusBar style="auto" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  } else {
    return null; // we can replace this with loading indicator if needed.
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1
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
    marginTop: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  header: {
    color: 'white',
    fontSize: 48,
    marginBottom: 12
  },
  button: {
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
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
});
