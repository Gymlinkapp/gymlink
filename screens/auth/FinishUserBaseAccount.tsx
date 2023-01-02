import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import api from '../../utils/axiosStore';

import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  Image,
  Platform,
  View,
  Button as RNBUtton,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Button from '../../components/button';
import { Camera, X } from 'phosphor-react-native';
import { COLORS } from '../../utils/colors';
import { useMutation } from 'react-query';
import useToken from '../../hooks/useToken';

const getPermissionAsync = async () => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return console.log('Permission to access location was denied');
    }
  }
};

export default function FinishUserBaseAccountScreen({ navigation, route }) {
  const [image, setImage] = useState<string[] | []>([]);
  const [token, setToken] = useState<string | null>(null);
  // get token from route params
  useEffect(() => {
    if (route.params) {
      setToken(route.params.token);
    } else {
      const t = getItemAsync('token').then((t) => {
        setToken(t);
      });
    }
  }, []);
  console.log('token', token);

  const addImage = async () => {
    try {
      await getPermissionAsync();
      const pickerRes = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (pickerRes.canceled) return;

      let result = pickerRes as ImageManipulator.ImageResult;

      const base64 = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 300 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.PNG, base64: true }
      );

      setImage([...image, base64.uri]);

      const res = await api.post('/users/images', {
        image: base64.base64,
        token: token,
      });
      console.log(res.data);
    } catch (err) {
      console.log(
        'An error occurred uploading your image. Please try again later. '
      );
      console.log(err);
    }
  };

  return (
    <SafeAreaView className='flex-1 justify-between '>
      <View className='flex-row flex-wrap w-full flex-1'>
        {image && image.length === 1 && (
          <View className='w-[45%] h-32 rounded-2xl m-2 overflow-hidden relative'>
            <TouchableOpacity className='absolute top-0 left-0 p-1 z-20'>
              <X color={COLORS.mainWhite} size={32} />
            </TouchableOpacity>
            <Image
              source={{ uri: image[0] }}
              className='w-full h-full object-cover z-10'
            />
          </View>
        )}
        {image &&
          image.length > 1 &&
          image.map((img, i) => (
            <View
              className='w-[45%] h-32 rounded-2xl m-2 overflow-hidden relative'
              key={i}
            >
              <TouchableOpacity
                className='absolute top-0 left-0 p-1 z-20'
                onPress={() => {
                  const newImage = image.filter((img, index) => index !== i);
                  setImage(newImage);
                }}
              >
                <X color={COLORS.mainWhite} size={32} />
              </TouchableOpacity>
              <Image
                source={{ uri: img }}
                className='w-full h-full object-cover'
              />
            </View>
          ))}
        {image && image && (image.length === 0 || image.length < 4) && (
          <TouchableOpacity
            onPress={addImage}
            className='bg-secondaryDark border-dotted border-2 border-tertiaryDark m-2 w-[45%] h-32 rounded-2xl justify-center items-center relative'
          >
            <Camera color={COLORS.secondaryWhite} size={48} />
          </TouchableOpacity>
        )}
      </View>
      <View>
        {image && image.length > 0 && (
          <Button
            variant='primary'
            onPress={async () => {
              await setItemAsync('token', token);

              navigation.popToTop();
              navigation.navigate('UserPrompts');
            }}
          >
            Continue
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}
