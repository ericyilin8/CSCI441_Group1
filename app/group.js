import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>

      <View style={styles.groups}>
        <Text style={
          {    
            color: 'white',
            fontSize: 48,
            marginBottom: 12 
          } 
        }>Groups</Text>
      </View>

      <Link href="/map">Map</Link>
      <Link href="/chat">Chat</Link>
      <Link href="/">Logout</Link>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40
  },
  groups: {
    width: '80%',
    height: '80%',
    marginTop: 40,
  },
});
