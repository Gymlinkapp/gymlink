import { NavigationState } from '@react-navigation/native';
import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, TextInput, View } from 'react-native';
import { io } from 'socket.io-client';
import Button from '../components/button';
import { useUser } from '../hooks/useUser';
import Layout from '../layouts/layout';
// import { socket } from '../utils/socket';

export default function Chats({ navigation, route }: any) {
  // const { socket } = route.params;
  // needs to be this for ios not localhost
  const socket = io('http://10.0.1.198:3000');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  // const { socket } = route.params;

  const sendMessage = () => {
    console.log(message);
    socket.emit('chat-message', { message: message });
  };

  useEffect(() => {
    getItemAsync('token').then((t) => setToken(t));
    socket.on('recieve-message', (data: any) => {
      setMessages((prev) => [...prev, data.message]);
      console.log(data);
      // console.log(data.message);
    });
  }, [socket]);
  // const { data: user, isLoading, error } = useUser(token);

  // if (isLoading) return <Text className='text-white'>Loading...</Text>;
  // if (error) return <Text className='text-white'>Error: {error.message}</Text>;

  return (
    <View className='flex-1 bg-primaryDark px-4'>
      <Text className='text-white'>Message</Text>
      <TextInput
        value={message}
        onChangeText={(text) => setMessage(text)}
        className='bg-secondaryDark text-white p-4 rounded-md'
      />
      {messages.length > 0 && (
        <FlatList
          className='p-4'
          data={messages}
          renderItem={(msg) => <Text className='text-white'>{msg.item}</Text>}
        />
      )}
      {socket && (
        <Button variant='primary' onPress={sendMessage}>
          Send
        </Button>
      )}
    </View>
  );
}
