import * as SecureStore from 'expo-secure-store';

export const userService = {
  login: async (username, password) => {
    try {
      console.log('Sending login request to:', process.env.EXPO_PUBLIC_SOCKET_URL + '/api/user/login');
      console.log('Sending login request:', { username, password });

      const requestBody = {
        username: username,
        password: password,
      };

      const response = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error('HTTP status:', response.status);
        throw new Error('Login failed');
      }

      const data = JSON.parse(response.data);

      await SecureStore.setItemAsync('jwt', data.token);
      
      return data;

    } catch (error) {
      console.error(error); // Log full error
      throw error;
    }
  },
  register: async (requestBody) => {
    try {
      console.log('Sending request to:', process.env.EXPO_PUBLIC_SOCKET_URL + '/api/user/register')
      console.log('Sending request:', requestBody);

      const response = await fetch(process.env.EXPO_PUBLIC_SOCKET_URL + '/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const text = await response.text();
      console.log('Response text:', text);

      if (!response.ok) {
        console.error('HTTP status:', response.status);
        throw new Error('Registration failed');
      }

      const data = JSON.parse(text);
      return data;

    } catch (error) {
      console.error(error); // Log full error
      throw error;
    }
  },
};

export default userService;
