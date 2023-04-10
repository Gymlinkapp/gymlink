import { useState } from 'react';
import { Modal } from 'react-native';
import { FlatList } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Filter, FilterValue } from '../utils/types/filter';

type Props = {
  options: Filter[];
  handleSelectOption: (option: FilterValue) => void;
};

export default function Filters({ options, handleSelectOption }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [values, setValues] = useState<FilterValue[]>([]);
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
        <View className='flex-1 bg-primaryDark justify-center p-12'>
          {values.map((option: FilterValue) => (
            <TouchableOpacity
              className='py-4 px-8 bg-secondaryDark rounded-md mb-4'
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
      </Modal>
    </View>
  );
}
