import * as SecureStore from 'expo-secure-store';

export const groupService = {
  getAllGroups: async () => {
    try {
      const response = await fetch(proc.env.EXPO_PUBLIC_SOCKET_URL + '/api/group', {
        headers: {
          'Authorization': await SecureStore.getItemAsync('jwt')
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  getGroupById: async (id) => {
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/api/group' + id, {
        headers: {
          'Authorization': await SecureStore.getItemAsync('jwt')
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  createGroup: async (group) => {
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/api/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': await SecureStore.getItemAsync('jwt')
        },
        body: JSON.stringify(group)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateGroup: async (id, group) => {
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/api/group' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': await SecureStore.getItemAsync('jwt')
        },
        body: JSON.stringify(group),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteGroup: async (id) => {
    try {
      const reponse = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/api/group' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': await SecureStore.getItemAsync('jwt')
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};