import { StatusBar } from 'expo-status-bar';
import { Alert, Button, TextInput, View, StyleSheet, Text } from 'react-native';
import { Link } from "expo-router";
import { useState } from 'react';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  onLogin = () => {
  }

  return (
    <View style={styles.container}>
    
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
        <Link href="/map" asChild>
        <Button
          title={'Login'}
          style={styles.input}
          onPress={onLogin}
        />
        </Link>
      <Link href="/register">Register</Link>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  }
});
