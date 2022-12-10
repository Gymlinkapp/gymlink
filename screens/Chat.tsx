import { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Button from '../components/button';
import { keyboardVerticalOffset } from '../utils/ui';
import { User } from '../utils/users';

interface Message {
  room: string;
  user: Partial<User>;
  message: string;
  time: string;
}

export default function ChatScreen({ route, navigation }) {
  const { socket, user, room } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    navigation.setOptions({ title: room });
    socket.emit('join-chat', room);
    socket.on('recieve-message', (data: Message) => {
      setMessages((messages) => [...messages, data]);
    });
  }, [socket]);

  const messageData: Message = {
    room: room,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    message: message,
    time:
      new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
  };

  const sendMessage = async () => {
    await socket.emit('chat-message', messageData);
    setMessages((messages) => [...messages, messageData]);
    setMessage('');
  };

  const amIAuthor = (message: Message) =>
    message.user.id === user.id ? 'flex-row-reverse' : 'flex-row';

  return (
    <SafeAreaView className='flex-1 bg-primaryDark px-4'>
      <FlatList
        className='p-4 flex-1'
        data={messages}
        renderItem={({ item }) => (
          <View className={`${amIAuthor(item)} my-2`}>
            <View className='flex-col w-1/2 bg-secondaryDark p-4 rounded-full'>
              {item.user.id !== user.id && (
                <Text className='text-secondaryWhite'>
                  {item.user.firstName} {item.user.lastName}
                </Text>
              )}
              <Text className='text-white'>{item.message}</Text>
            </View>
          </View>
        )}
      />

      {socket && (
        <KeyboardAvoidingView
          className='px-4'
          behavior='position'
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <View className='flex-row items-center bg-primaryDark'>
            <View className='flex-1 mr-2'>
              <TextInput
                value={message}
                onChangeText={(text) => setMessage(text)}
                className='bg-secondaryDark text-white p-4 rounded-md'
              />
            </View>
            <Button variant='primary' textSize='xs' onPress={sendMessage}>
              Send
            </Button>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
