import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  FlatList,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';
import Button from '../components/button';
import { COLORS } from '../utils/colors';
import { keyboardVerticalOffset } from '../utils/ui';
import api from '../utils/axiosStore';
import { useFriends } from '../hooks/useFriends';
import { useState } from 'react';
import { User } from '../utils/users';

const createChatSchema = z.object({
  name: z.string(),
  friend: z.string(),
  // password: z.string().min(8).max(20),
});

export default function CreateChatScreen({ navigation, route }) {
  const queryClient = useQueryClient();
  const { user } = route.params;
  const { data: userFriends, isLoading: userFriendsLoading } = useFriends(
    user.tempJWT
  );
  const [selectedFriends, setSelectedFriends] = useState<User[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<User>();
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createChatSchema),
    defaultValues: {
      name: '',
      friend: '',
      //   password: '',
    },
  });

  const createChat = useMutation(
    async (data: z.infer<typeof createChatSchema>) => {
      try {
        return await api.post('/chats', {
          name: data.name,
          userId: user.id,
          friend: data.friend,
        });
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries('chats');
          navigation.popToTop();
          navigation.navigate('Chats');
        }
      },
    }
  );

  const autoCompleteFriend = async (text: string) => {
    if (text.length > 0) {
      const filteredFriends = userFriends.filter((friend) => {
        return friend.firstName.toLowerCase().includes(text.toLowerCase());
      });
      setSelectedFriends(filteredFriends);
    } else {
      setSelectedFriends(userFriends);
    }
  };

  const onSubmit = async (data: z.infer<typeof createChatSchema>) => {
    try {
      createChat.mutate(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View className='bg-primaryDark flex-1 px-6'>
      <View className='py-6'>
        <Text className='text-2xl font-MontserratBold text-primaryWhite'>
          Create a chat!
        </Text>
        <Text className='text-base font-MontserratRegular text-secondaryWhite'>
          Pick a name and invite your friends!
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior='position'
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <FlatList
          className='bg-primaryDark'
          data={[1]}
          renderItem={() => (
            <>
              <Controller
                control={control}
                name='name'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error, isTouched },
                }) => (
                  <View className='my-2'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      Chat name
                    </Text>
                    <TextInput
                      className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                        isTouched && 'border-2 border-tertiaryDark'
                      }`}
                      cursorColor={COLORS.mainWhite}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                    {error && (
                      <Text className='text-red-500 font-MontserratRegular'>
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={control}
                name='friend'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { isTouched, error },
                }) => (
                  <View className='my-2 flex-1'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      Invite a friend
                    </Text>
                    <View className='flex-1'>
                      <TextInput
                        className={`bg-secondaryDark rounded-t-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                          isTouched && 'border-2 border-tertiaryDark'
                        }`}
                        cursorColor={COLORS.mainWhite}
                        value={
                          selectedFriend
                            ? `${selectedFriend.firstName} ${selectedFriend.lastName}`
                            : value
                        }
                        onBlur={onBlur}
                        onChangeText={(value) => {
                          onChange(value);
                          autoCompleteFriend(value);
                        }}
                      />
                      {selectedFriends?.length > 0 && (
                        <View className='bg-secondaryDark rounded-b-md'>
                          <FlatList
                            data={selectedFriends}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                className='px-2 py-6 border-b-2 border-tertiaryDark'
                                onPress={() => {
                                  setValue('friend', item.id);
                                  setSelectedFriend(item);
                                  setSelectedFriends([]);
                                }}
                              >
                                <Text className='text-white font-MontserratMedium'>
                                  {item.firstName} {item.lastName}
                                </Text>
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      )}
                    </View>
                    {error && (
                      <Text className='text-red-500 font-MontserratRegular'>
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </>
          )}
        />

        <Button variant='primary' onPress={handleSubmit(onSubmit)}>
          Create
        </Button>
      </KeyboardAvoidingView>
    </View>
  );
}
