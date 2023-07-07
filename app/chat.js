import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";
import React, { useState, useCallback, useEffect } from 'react'
import {GiftedChat} from 'react-native-gifted-chat'
import socketIO from 'socket.io-client';
import { SOCKET_URL } from 'react-native-dotenv';

const socket = socketIO(SOCKET_URL);

export default function App() {
  const [messages, setMessages] = useState([])
  
  socket.on('UpdateMessages', (NewMessages) => {console.log(NewMessages); setMessages(NewMessages)})

  /*const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])*/

  const onSend = useCallback((msg = []) => {
    socket.emit('newMessage', msg)
  }, [])

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
      user={{
        _id: 1,
      }}
    />
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