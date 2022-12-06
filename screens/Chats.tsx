import { NavigationState } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, TextInput, View } from 'react-native';
import io from 'socket.io-client';
import Button from '../components/button';
import Layout from '../layouts/layout';
// import { socket } from '../utils/socket';
const socket = io('http://localhost:3000');

export default function Chats({ navigation, route }: any) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  // const { socket } = route.params;

  // const sendMessage = (msg: string) => {
  //   socket.emit('chat-message', msg);
  // };

  useEffect(() => {
    socket.on('recieve-message', (data: any) => {
      setMessages([...messages, data.message]);
      // console.log(data.message);
    });

    console.log(messages);
  }, [socket]);

  return (
    <View className='flex-1 bg-primaryDark px-4'>
      <Text className='text-white'>test</Text>
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
        <Button
          variant='primary'
          onPress={() => {
            socket.emit('chat-message', { message: message });
            setMessage('');
          }}
        >
          Send
        </Button>
      )}
    </View>
  );
}
