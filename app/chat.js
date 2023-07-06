import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from "expo-router";
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

export default function App() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])


  return (
    <View style={styles.container}>
    <Link href="/map" asChild>
      <Text style={styles.BackLink}>Back to map</Text>
    </Link>
    <GiftedChat
      style={styles.GiftedChat}
      messages={messages}
      onSend={messages => onSend(messages)}
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
    flex: 1
  },
  BackLink: {
    margin: 60
  }
});