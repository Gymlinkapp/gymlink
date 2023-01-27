import { NavigationState } from '@react-navigation/native';
import { getItemAsync } from 'expo-secure-store';
import { ChatsTeardrop, Plus } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { io } from 'socket.io-client';
import Button from '../components/button';
import Loading from '../components/Loading';
import { useChats } from '../hooks/useChats';
import useToken from '../hooks/useToken';
import { useUser } from '../hooks/useUser';
import Layout from '../layouts/layout';
import { keyboardVerticalOffset } from '../utils/ui';
import { User } from '../utils/users';
import EmptyScreen from '../components/EmptyScreen';
import { useAuth } from '../utils/context';

export type Message = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  chatId?: string;
  senderId?: string;
  sender?: User;
  content: string;
};

export interface Chat {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: User[];
  messages: Message[];
}

export default function Chats({ navigation, route }: any) {
  const { socket } = route.params;

  const [room, setRoom] = useState('');
  const { user } = useAuth();

  const {
    data: chats,
    isLoading: isMessagesLoading,
    error: messagesError,
  } = useChats(user?.id || '');

  if (isMessagesLoading) return <Loading />;
  if (messagesError)
    return <Text className='text-white'>Error: {messagesError.message}</Text>;

  return (
    <View className='relative flex-1'>
      <TouchableOpacity
        className='bg-white w-12 h-12 rounded-full justify-center items-center absolute bottom-5 right-5'
        onPress={() =>
          navigation.navigate('CreateChat', {
            user: user,
          })
        }
      >
        <Plus weight='bold' />
      </TouchableOpacity>
      {chats?.length ? (
        <View>
          <FlatList
            className='p-4'
            data={chats}
            renderItem={({ item }) => (
              <TouchableOpacity
                className='flex-row items-center my-2 bg-secondaryDark p-4 rounded-md'
                onPress={() =>
                  navigation.navigate('Chat', {
                    socket: socket,
                    user: user,
                    roomName: item.name,
                    roomId: item.id,
                  })
                }
              >
                <View className='bg-primaryDark mr-4 w-12 h-12 rounded-full' />
                <View className='flex-col'>
                  <Text className='text-white text-xl'>{item.name}</Text>
                  <Text className='text-secondaryWhite'>
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      ) : (
        <EmptyScreen
          icon={
            <ChatsTeardrop weight='fill' color='rgb(204,201,201)' size={48} />
          }
          text='You have no chats yet'
        />
      )}
    </View>
  );
}
