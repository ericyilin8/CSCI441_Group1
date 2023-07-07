import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";
import { Entypo } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={styles.container}>

      <View style={styles.groups}>
        <Text style={
          {    
            color: 'white',
            fontSize: 48,
            marginTop: 40 
          } 
        }>Groups</Text>
      </View>

      <View style={styles.navigation}>
        <Link href="/map" asChild>
          <Entypo style={styles.BackLink} name="back" size={36} color="white" />     
        </Link>
        <Link href="/chat" asChild>
          <Entypo name="chat" size={36} color="white" />
        </Link>
        <Link href="/" asChild>
          <Text style={{color: "white"}}>LOGOUT</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  groups: {
    width: '80%',
    height: '90%',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
  },
});
