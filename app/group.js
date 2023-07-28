import React, { useState, useEffect, useContext } from 'react';
import { Image, View, Text, Pressable, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Link } from "expo-router";
import { Entypo, AntDesign } from '@expo/vector-icons';
import { AppStateContext } from '../contexts/AppState';
import * as SecureStore from 'expo-secure-store';
import { LoadingComponent } from '../components/loading'
import userService from '../services/userService';
import imageService from '../services/ImageService';
import { AppConstants } from '../contexts/AppConstants';

export default function App() {
  const [groups, setGroups] = useState([]); // To store the user's groups
  const [showGroups, setShowGroups] = useState(true); // To toggle the visibility of the group list
  const [searchQuery, setSearchQuery] = useState(''); // To store the user search query
  const [groupLoading, setGroupLoading] = useState([]);
  const { socket, setSocket, user, currentGroup, setCurrentGroup } = useContext(AppStateContext);
  const { LEADER_ICON_URI } = useContext(AppConstants);

  const [loading, setLoading] = useState(false); // To store the user's groups

  useEffect(() => {
    // Fetch the user's groups from the server when the component mounts
    fetchGroups();
  }, []);

  const handleLogout = async () => {
    try {
      // disconnect socket and clear the socket context
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
  
      // clear currentGroup
      setCurrentGroup(null);
  
      // call userService.logout
      await userService.logout();
  
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let groups = await response.json();

      // Initialize loading statuses
      let loading = groups.map(group => group.avatar ? true : false);
      setGroupLoading(loading);

      // Download group avatar images
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].avatar) {
          console.log("Attempting to download from server image: ", groups[i].avatar);
          try {
            groups[i].avatar = await imageService.downloadImageFromServer(groups[i].avatar, token);
            groupLoading[i] = false;
            console.log(groups[i].name, "avatar set to", groups[i].avatar);
          } catch (error) {
            console.error('Error downloading group avatar:', error);
          }
        }
      }

      setGroupLoading(groupLoading);

      setGroups(groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  // Sets the active group
  const handleGroupPress = async (group) => {
    await userService.setActiveGroup(socket, group._id); // sends group._id to server to set User.CurrentGroup in DB
    setCurrentGroup(group); // updates the local group context
    user.currentGroup = group._id;
  };

  const handleAddUser = async () => {
    try {
      setLoading(true);
      const body = {
        username: searchQuery,
        groupId: user.currentGroup,
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
      console.log("User added", data)
      setLoading(false)
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
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
          <Pressable style={styles.addButton} onPress={handleAddUser}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Add User</Text>
          </Pressable>
        </View>


        <View style={styles.groups}>
          <Text style={{ color: 'white', fontSize: 48, marginTop: 8 }}>
            Groups
            <Pressable onPress={() => setShowGroups(!showGroups)}>
              <Entypo
                name={showGroups ? 'chevron-down' : 'chevron-up'}
                size={36}
                color="white"
              />
            </Pressable>
          </Text>
          {showGroups && (
          <View style={styles.groupsContainer}>
            {groups.map((group, i) => (
              <Pressable
                key={group._id}
                onPress={() => handleGroupPress(group)}
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
                      backgroundColor: currentGroup && currentGroup._id === group._id ? 'blue' : 'transparent',
                    }}
                  />
                </View>
                {groupLoading[i] ? (
                  <LoadingComponent />
                ) : (
                  group.avatar && <Image source={{ uri: group.avatar }} style={ styles.groupAvatar }/>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '50%' }}>
                  <Text
                    style={{
                      color: currentGroup && currentGroup._id === group._id ? 'blue' : 'white',
                      fontSize: 24,
                      marginLeft: 10, // added to space text from avatar
                    }}
                  >
                    {group.name}
                  </Text>
                  {group.leader === user._id && (
                    <Pressable
                      style={({ pressed }) => [
                        {
                          backgroundColor: pressed
                          ? 'rgba(0, 0, 0, 0.1)'
                          : 'transparent',
                        },
                        styles.leaderIconButton,
                      ]}
                      onPress={() => {
                        // handle press here
                      }}
                    >
                      <Image
                        source={ LEADER_ICON_URI }
                        style={styles.leaderIcon}
                        resizeMode="contain"
                      />
                    </Pressable>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}

        </View>

        <Link href="/creategroup" asChild>
          <Pressable style={styles.GroupButton} onPress={() => console.log('Create group')}>
            <Text style={styles.GroupButtonText}>New Group</Text>
          </Pressable>
        </Link>

        <View style={styles.navigation}>
          <Link href="/map" asChild>
            <AntDesign
              style={{ color: "#23A7E0", opacity: currentGroup && currentGroup._id ? 1 : 0.2 }}
              name="enviroment"
              size={36}
            />
          </Link>
          <Link href="/chat" asChild>
            <Entypo
              style={{ color: "#23A7E0", opacity: currentGroup && currentGroup._id ? 1 : 0.2 }}
              name="chat"
              size={36}
            />
          </Link>
          <Pressable onPress={handleLogout}>
            <Text style={{ color: "#23A7E0" }}>LOGOUT</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groups: {
    width: '80%',
  },
  navigation: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
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
  groupAvatar: {
    width: 50,
    height: 50,
  },
  scrollContainer: {
    flexGrow: 1
  },
  leaderIconButton: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
    width: 30,
    height: 30,
  },
  
  leaderIcon: {
    width: '100%',
    height: '100%',
  },
  groupsContainer: {
    borderBottomWidth: 5,
    borderColor: '#fff',
  }
});
