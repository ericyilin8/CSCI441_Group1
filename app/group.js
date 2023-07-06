import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Group Page</Text>
      <Link href="/map">Map</Link>
      <Link href="/chat">Chat</Link>
      <StatusBar style="auto" />

      <View style={styles.groups}>
        <Text>Groups</Text>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 40
  },
  groups: {
    flex: 1,
    backgroundColor: '#fff',
    width: '80%',
    marginTop: 40
  },
});
