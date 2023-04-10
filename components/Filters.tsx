import { useState } from 'react';
import { Modal } from 'react-native';
import { FlatList } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Filter, FilterValue } from '../utils/types/filter';
import { useAuth } from '../utils/context';
import { X } from 'phosphor-react-native';

type Props = {
  options: Filter[];
  handleSelectOption: (option: FilterValue) => void;
};

export default function Filters({ options, handleSelectOption }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [values, setValues] = useState<FilterValue[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const { setFilters } = useAuth();
  return (
    <View className='h-12 w-full py-2 absolute top-0  z-50'>
      <FlatList
        data={options}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.filter}
        renderItem={({ item: filter }) => (
          <TouchableOpacity
            onPress={() => {
              // handleSelectOption(filter);
              setModalVisible(true);
              setValues(filter.values);
              setModalTitle(filter.name);
            }}
            className='flex flex-row items-center bg-primaryDark mr-1 rounded-full px-4 py-0'
          >
            <Text className='text-white font-MontserratMedium text-xs'>
              {filter.name}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className='flex-1 justify-end items-end w-full'>
          <View className='bg-primaryDark  w-full h-1/2 l p-12 rounded-2xl'>
            <View className='m-2 flex-row items-center w-full justify-between'>
              <Text className='text-white text-xl font-MontserratMedium'>
                {modalTitle}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <X color='#fff' />
              </TouchableOpacity>
            </View>
            <View className='flex-row flex-wrap'>
              {values.map((option: FilterValue) => (
                <TouchableOpacity
                  className='py-4 px-8 bg-secondaryDark rounded-md m-2'
                  key={option.name}
                  onPress={() => {
                    // handleSelectOption(option.name)
                    setModalVisible(false);
                  }}
                >
                  <Text className='text-white font-MontserratMedium'>
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
