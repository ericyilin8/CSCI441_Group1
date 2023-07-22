import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, Image } from 'react-native';
import { Link } from "expo-router";
import React, { useState, useCallback, useEffect, useContext } from 'react'
import {GiftedChat, Bubble} from 'react-native-gifted-chat'
import { Entypo } from '@expo/vector-icons';
import { AppStateContext } from '../contexts/AppState';
import jwtDecode from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';

export default function App() {
  const { socket } = useContext(AppStateContext);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);
  const [userId, setId] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        const username = decodedToken.username;
        const userId = decodedToken.id;
        setUsername(username);
        setId(userId);
      }
    };
  
    fetchToken();

    // Event listeners
    socket.on('UpdateMessages', (NewMessages) => {setMessages(NewMessages)});

    // Cleanup function
    return () => {
      socket.off('UpdateMessages');
    };
  }, []);

  const onSend = useCallback((msg = []) => {
    socket.emit('newMessage', msg)
  }, [socket]);

  const renderCustomBubble = (props) => {
    if(props.currentMessage.image){
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: { width: '60%'},
            right: { width: '60%'},
            // Add other custom styles as needed
          }}
          imageStyle={{
            flex: 1,
            borderRadius: 8,
            height: 400,
            width: '100%',
          }}
          imageProps={{
            resizeMode: 'cover',
            fadeDuration: 0 // Remove the fade transition effect
            // Add other custom image props as needed
          }}
        />
      );
    }
    else{
      return <Bubble {...props} />
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link href="/map" asChild>
          <Entypo name="back" size={36} color="white" />
        </Link>
        <Link href="/camera" asChild>
          <Entypo name="camera" size={36} color="white" />
        </Link>
      </View>
      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={msg => onSend(msg)}
          renderUsernameOnMessage
          showUserAvatar
          renderBubble={props => renderCustomBubble(props)}
          user={{
            _id: userId,
            name: username,
            avatar: ''
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  chatContainer: {
    backgroundColor: 'white',
    flex: 1,
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowOffset: { width: 2, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    paddingBottom:40,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
    marginLeft: 20,
  }
});
