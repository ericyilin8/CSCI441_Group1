import { Alert, StyleSheet, Text, View, Image } from 'react-native';
import { Link } from "expo-router";
import React, { useState, useCallback, useEffect, useContext } from 'react'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { Entypo, Ionicons, AntDesign } from '@expo/vector-icons';
import { AppStateContext } from '../contexts/AppState';
import jwtDecode from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';

export default function Chat() {
  const { socket, setSocket, currentGroup, user } = useContext(AppStateContext);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);
  const [userId, setId] = useState(null);

  useEffect(() => {
    (async () => {
      
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;
      
      const decodedToken = jwtDecode(token);
      const username = decodedToken.username;
      const userId = decodedToken.id;
      setUsername(username);
      setId(userId);

      socket.on('connect', () => {
        console.log('connected to chat!')
        setSocket(socket);
      })

      //get messages
      socket.emit('getMessages', user.currentGroup);

      // Event listeners
      socket.on('UpdateMessages', (NewMessages) => { 
        setMessages(NewMessages)
        console.log(NewMessages);
      });

      // Cleanup function
      return () => {
        socket.off('UpdateMessages');
      };
    })()
  }, [currentGroup]);

  const onSend = useCallback((msg = []) => {
    msg[0].groupId = user.currentGroup;
    console.log(msg[0].groupId)
    socket.emit('newMessage', msg[0])
  }, [socket]);

  const renderCustomBubble = (props) => {
    if (props.currentMessage.image) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: { width: '60%' },
            right: { width: '60%' },
            // Add other custom styles as needed
          }}
          renderMessageImage={renderMessageImage}
        />
      );
    }
    else {
      return <Bubble {...props} />
    }
  };
  
  const renderMessageImage = (props) => {
    console.log(props);
    return (
      <Image
        source={{ uri: props.currentMessage.image }}
        style={{
          flex: 1,
          borderRadius: 8,
          height: 400,
          width: '100%',
          resizeMode: 'cover',
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link href="/group" asChild>
          <Ionicons name="people-circle-outline" size={36} color="#fff" />
        </Link>
        <Link href="/map" asChild>
        <AntDesign style={{ color: "#fff", opacity: 1 }} name="enviroment" size={36} />
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
    paddingBottom: 40,
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
