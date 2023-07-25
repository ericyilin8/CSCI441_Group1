import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Link } from "expo-router";
import { Entypo } from '@expo/vector-icons';
import { AppStateContext } from '../contexts/AppState';
import * as SecureStore from 'expo-secure-store';
import io from 'socket.io-client';
import { LoadingComponent } from '../components/loading'

export default function App() {
  const [groups, setGroups] = useState([]); // To store the user's groups
  const [showGroups, setShowGroups] = useState(true); // To toggle the visibility of the group list
  const [searchQuery, setSearchQuery] = useState(''); // To store the user search query

  const { currentGroup, setCurrentGroup } = useContext(AppStateContext);
  const { socket, setSocket } = useContext(AppStateContext);

  const [loading, setLoading] = useState(false); // To store the user's groups

  useEffect(() => {
    // Fetch the user's groups from the server when the component mounts
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');

      const response = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/api/group',
        {
          method: 'GET',
          headers: {
            Authorization: token
          }
        });
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleGroupPress = async (groupId) => {
    socket.disconnect();
    const token = await SecureStore.getItemAsync('userToken');
    const newSocket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
      query: {
        token: token,
        groupId: groupId,
      }
    });
    setSocket(newSocket);
    setCurrentGroup(groupId);
  };

  const handleAddUser = async () => {
    try {
      setLoading(true);
      const body = {
        username: searchQuery,
        groupId: currentGroup,
      }

      console.log('adding user...', body)

      const token = await SecureStore.getItemAsync('userToken');

      const response = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/api/group/addUser',
        {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          }
        });
      const data = await response.json();
      console.log("user added", data)
      setLoading(false)
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  if(loading)
    return <LoadingComponent />

  else
    return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps='handled' // Closes keyboard when tapping outside of TextInput
    >
      <View style={styles.container}>

        {/* Section for adding a new user */}
        <View style={styles.addUserSection}>
          <TextInput
            style={styles.input}
            placeholder="Search for users"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Add User</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.groups}>
          <Text style={{ color: 'white', fontSize: 48, marginTop: 8 }}>
            Groups
            <TouchableOpacity onPress={() => setShowGroups(!showGroups)}>
              <Entypo
                name={showGroups ? 'chevron-down' : 'chevron-up'}
                size={36}
                color="white"
              />
            </TouchableOpacity>
          </Text>
          {showGroups && (
          <ScrollView style={{height: 400}}>
            {groups.map((group) => (
              <TouchableOpacity
                key={group._id}
                onPress={() => handleGroupPress(group._id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 16,
                }}
              >
              <View style={{width: '10%'}}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      marginRight: 8,
                      backgroundColor: currentGroup === group._id ? 'blue' : 'transparent',
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: currentGroup === group._id ? 'blue' : 'white',
                    fontSize: 28,
                  }}
                >
                  {group.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        </View>

        <Link href="/creategroup" asChild>
          <TouchableOpacity style={styles.GroupButton} onPress={() => console.log('Create group')}>
            <Text style={styles.GroupButtonText}>New Group</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.navigation}>
          <Link href="/map" asChild>
            <Entypo style={styles.BackLink} name="back" size={36} color="white" />
          </Link>
          <Link href="/chat" asChild>
            <Entypo style={{ opacity: 0 }} name="chat" size={36} color="white" />
          </Link>
          <Link href="/" asChild>
            <Text style={{ color: "white", opacity: 0 }}>LOGOUT</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  groups: {
    width: '80%',
    height: '65%',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
  },
  addUserSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 80,
    width: '80%',
  },
  input: {
    width: 200,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  GroupButton: {
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
  GroupButtonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  scrollContainer: {
    flexGrow: 1
  },
});
