import { ChatsTeardrop } from 'phosphor-react-native';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { User } from '../utils/users';
import EmptyScreen from '../components/EmptyScreen';
import { useAuth } from '../utils/context';
import { Image } from 'react-native';
import { useState } from 'react';

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

  const { user, token } = useAuth();

  return (
    <View className='flex-1'>
      {user && user.chats && user.chats.length ? (
        <View>
          <FlatList
            className='p-4'
            data={user.chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              // chats don't have messages by default, so we need to check if they exist
              let recentMessage: Message | undefined;
              if (item.messages && item.messages.length) {
                recentMessage = item.messages[item.messages.length - 1];
              }

              const me = item.participants.find(
                (u: User) => u.id === user.id
              ) as User;
              const otherUser = item.participants.find(
                (u: User) => u.id !== user.id
              ) as User;
              return (
                <TouchableOpacity
                  className='flex-row items-center my-2 bg-secondaryDark p-4 rounded-md'
                  onPress={() => {
                    navigation.navigate('Chat', {
                      socket: socket,
                      user: user,
                      roomName: item.name,
                      toUser: otherUser,
                      userImage: otherUser.images[0],
                      uiName: `${otherUser.firstName} ${otherUser.lastName}`,
                      roomId: item.id,
                    });
                  }}
                >
                  <Image
                    source={{ uri: otherUser.images[0] }}
                    className='w-[50px] h-[50px] rounded-full mr-4'
                  />
                  <View className='flex-col'>
                    <Text className='text-white text-xl'>
                      {otherUser.firstName} {otherUser.lastName}
                    </Text>
                    {recentMessage && (
                      <View className='flex-row items-center'>
                        <Text className='text-white mr-2 text-md'>
                          {recentMessage.content}
                        </Text>
                        <Text className='text-secondaryWhite text-xs'>
                          {new Date(recentMessage.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              hour: 'numeric',
                              minute: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
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
