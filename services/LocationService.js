import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { getDistance } from 'geolib';

const LOCATION_UPDATE_TASK_NAME = 'background-location-update';
const UPDATE_INTERVAL_IN_MS = 5 * 60 * 1000; // send location regardless of movement this often, currently 5 mins
const UPDATE_DISTANCE_IN_M = 2; // distance moved that will trigger shareLocation event in meters

let lastLocationSent = null;
let lastTimeSent = null;
let socket = null;

/* Location.requestBackgroundPermissionAsync() NOT SUPPORTED BY EXPO GO LAB ENVIRONMENT

// Define the task that will be run in the background
TaskManager.defineTask(LOCATION_UPDATE_TASK_NAME, ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for the error message
    return;
  }

  const newLocation = locations[0];

  // If AUTO_UPDATE_INTERVAL has passed since last shareLocation socket event or user has moved more than UPDATE_DISTANCE_IN_M
  if (
    (!lastTimeSent || new Date() - lastTimeSent >= UPDATE_INTERVAL_IN_MS) ||
    (!lastLocationSent || getDistance(newLocation.coords, lastLocationSent.coords) >= UPDATE_DISTANCE_IN_M)
  ) {
    console.log('Sending location to server:', newLocation);
    socket.emit('shareLocation', newLocation);
    lastLocationSent = newLocation;
    lastTimeSent = new Date();
  }
});

async function startLocationUpdates(newSocket) {
  const { status } = await Location.requestBackgroundPermissionAsync();
  if (status === 'granted') {
    socket = newSocket;
    await Location.startLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 5000,  // Update every 5 seconds
    });
  }
}

async function startLocationUpdates(newSocket) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === 'granted') {
    socket = newSocket;
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000,  // Update every 5 seconds
      }
    );
  }
}

async function stopLocationUpdates() {
  try {
    await Location.stopLocationUpdatesAsync(LOCATION_UPDATE_TASK_NAME);
  } catch (error) {
    console.log(`Failed to stop location updates: ${error.message}`);
  }
}

*/

let locationSubscription;

async function startLocationUpdates(newSocket) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === 'granted') {
    socket = newSocket;
    locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000,  // Update every 5 seconds
      }, 
      (location) => {
        // Check if AUTO_UPDATE_INTERVAL has passed since the last shareLocation socket event
        // or if the user has moved more than UPDATE_DISTANCE_IN_M
        if (
          (!lastTimeSent || new Date() - lastTimeSent >= UPDATE_INTERVAL_IN_MS) ||
          (!lastLocationSent || getDistance(location.coords, lastLocationSent.coords) >= UPDATE_DISTANCE_IN_M)
        ) {
          console.log('Sending location to server:', location);
          socket.emit('shareLocation', location);
          lastLocationSent = location;
          lastTimeSent = new Date();
        }
      }
    );
  }
}

async function stopLocationUpdates() {
  if (locationSubscription) {
    locationSubscription.remove();
  }
}

export { startLocationUpdates, stopLocationUpdates };