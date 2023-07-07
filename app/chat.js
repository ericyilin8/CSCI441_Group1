import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";
import React, { useState, useCallback, useEffect } from 'react'
import {GiftedChat} from 'react-native-gifted-chat'
import socketIO from 'socket.io-client';


export default function App() {
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null);
  const [ID, setID] = useState(Math.ceil(Math.random()*100));
  
  useEffect(() => {
    // Connect to the Socket.io server
    const socket = socketIO('https://adventurous-pointed-ocean.glitch.me')
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
    <Link href="/map" asChild>
      <Text style={styles.BackLink}>Back to map</Text>
    </Link>
    <GiftedChat
      style={styles.GiftedChat}
      messages={messages}
      onSend={msg => onSend(msg)}
      renderUsernameOnMessage
      showUserAvatar
      user={{
        _id: ID,
        name: "Andrew Carmichael",
        avatar: 'https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg'
      }}
    />
    <Text>{ID}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:40
  },
  BackLink: {
    margin: 60
  }
});