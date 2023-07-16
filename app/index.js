import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, TextInput, View, StyleSheet, Text, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Link } from "expo-router";
import { useState } from 'react';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  onLogin = () => {
  }

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
            <Link href="/map" asChild>
            <Pressable onPress={onLogin} style={styles.button}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </Pressable>
            </Link>
            <Link href="/components/Register" asChild>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>REGISTER</Text>
              </Pressable>
            </Link>
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
