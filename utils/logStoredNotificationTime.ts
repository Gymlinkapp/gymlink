import * as SecureStore from 'expo-secure-store';
export async function logStoredTime() {
  try {
    const storedHour = await SecureStore.getItemAsync('randomHour');
    const storedMinute = await SecureStore.getItemAsync('randomMinute');
    if (storedHour && storedMinute) {
      console.log('Stored Time:', `${storedHour}:${storedMinute}`);
    } else {
      console.log('No time stored yet.');
    }
  } catch (error) {
    console.log('Error reading stored time:', error);
  }
}
