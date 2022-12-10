import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  FlatList,
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useMutation } from 'react-query';
import { z } from 'zod';
import Button from '../components/button';
import { COLORS } from '../utils/colors';
import { keyboardVerticalOffset } from '../utils/ui';
import api from '../utils/axiosStore';

const createChatSchema = z.object({
  name: z.string(),
  // password: z.string().min(8).max(20),
});

export default function CreateChatScreen({ navigation, route }) {
  const { user } = route.params;
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
      //   password: '',
    },
  });

  const createChat = useMutation(
    async (data: z.infer<typeof createChatSchema>) => {
      try {
        return await api.post('/chats', {
          name: data.name,
          userId: user.id,
          people: [],
        });
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: (data) => {
        if (data) {
          navigation.popToTop();
          navigation.navigate('Chats');
        }
      },
    }
  );

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
              {/* <Controller
                control={control}
                name='password'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error, isTouched },
                }) => (
                  <View className='my-2'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      Password
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
              /> */}
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
