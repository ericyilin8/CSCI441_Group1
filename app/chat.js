import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, Image } from 'react-native';
import { Link } from "expo-router";
import React, { useState, useCallback, useEffect } from 'react'
import {GiftedChat, Bubble} from 'react-native-gifted-chat'
import socketIO from 'socket.io-client';
import { Entypo } from '@expo/vector-icons';


export default function App() {
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null);
  const [ID, setID] = useState(Math.ceil(Math.random()*100));
  
  useEffect(() => {
    // Connect to the Socket.io server
    const socket = socketIO(process.env.EXPO_PUBLIC_SOCKET_URL)
    setSocket(socket)

    // Event listeners
    socket.on('UpdateMessages', (NewMessages) => {setMessages(NewMessages)})

    // Clean up the connection on component unmount
    return () => {
      socket.disconnect()
    };
  }, []);

  /*const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])*/

  const onSend = useCallback((msg = []) => {
    socket.emit('newMessage', msg)
  }, [socket]);

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
            _id: ID,
            name: "Andrew Carmichael",
            avatar: 'https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg'
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
