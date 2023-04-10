import { useState } from 'react';
import { Modal } from 'react-native';
import { FlatList } from 'react-native';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Filter, FilterValue, defaultFilters } from '../utils/types/filter';
import { useAuth } from '../utils/context';
import { X } from 'phosphor-react-native';
import Button from './button';
import { BlurView } from 'expo-blur';

export default function Filters() {
  const [modalVisible, setModalVisible] = useState(false);
  const [values, setValues] = useState<FilterValue[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedValues, setSelectedValues] = useState<FilterValue[]>([]);
  const { setFilters, filters } = useAuth();

  // every time a user clicks save, we want to update the filters in the context, the transform the filters and send them to the server.

  const handleSave = () => {
    // keep the filters that are not selected, change the filters name to the first/only value and values to the selected values
    const newFilters = filters.map((filter) => {
      const selectedValue = selectedValues.find(
        (value) => value.filter === filter.filter
      );
      if (selectedValue) {
        return {
          ...filter,
          name: selectedValue.name,
          values: [selectedValue],
        };
      }
      return filter;
    });

    setFilters(newFilters);

    console.log('filters', selectedValues);

    setModalVisible(false);
  };

  console.log('filters', filters);
  return (
    <View className='h-12 w-full py-2 pointer-events-none absolute top-0 z-50'>
      <FlatList
        data={filters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.filter}
        renderItem={({ item: filter, index }) => (
          <>
            <BlurView
              intensity={25}
              className='bg-primaryDark/50 rounded-full overflow-hidden flex flex-row items-center  mr-1  px-4 py-0'
            >
              <TouchableOpacity
                onPress={() => {
                  // handleSelectOption(filter);
                  setModalVisible(true);
                  setValues(filter.values);
                  setModalTitle(filter.name);
                }}
              >
                <Text className='text-white font-MontserratMedium text-xs'>
                  {filter.name}
                </Text>
              </TouchableOpacity>
            </BlurView>

            {index === filters.length - 1 && (
              <TouchableOpacity
                onPress={() => {
                  setFilters(defaultFilters);
                }}
                className='flex flex-row items-center bg-primaryWhite mr-1 rounded-full px-4 py-0'
              >
                <Text className='text-primaryDark font-MontserratMedium text-xs'>
                  Clear
                </Text>
              </TouchableOpacity>
            )}
          </>
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
            <View className='flex-row flex-wrap flex-1'>
              {values.map((option: FilterValue) => (
                <TouchableOpacity
                  className={`py-4 px-8 
                    ${
                      selectedValues.find(
                        (selectedValue) => selectedValue.value === option.value
                      )
                        ? 'bg-primaryWhite'
                        : 'bg-secondaryDark'
                    }
                  rounded-md m-2`}
                  key={option.name}
                  onPress={() => {
                    // setSelectedValues([...selectedValues, option]);
                    // if options are true or false, only allow one to be selected
                    if (option.value === true || option.value === false) {
                      setSelectedValues([option]);
                    } else {
                      // if options are not true or false, allow multiple to be selected
                      if (
                        selectedValues.find(
                          (selectedValue) =>
                            selectedValue.value === option.value
                        )
                      ) {
                        setSelectedValues(
                          selectedValues.filter(
                            (selectedValue) =>
                              selectedValue.value !== option.value
                          )
                        );
                      } else {
                        setSelectedValues([
                          ...selectedValues,
                          {
                            filter: option.filter,
                            name: option.name,
                            value: option.value,
                          },
                        ]);
                      }
                    }
                  }}
                >
                  <Text
                    className={`${
                      selectedValues.find(
                        (selectedValue) => selectedValue.value === option.value
                      )
                        ? 'text-primaryDark'
                        : 'text-primaryWhite'
                    } font-MontserratMedium`}
                  >
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className='flex-row w-full'>
              <Button
                variant='secondary'
                className='flex-1'
                onPress={() => {
                  setSelectedValues([]);
                  setFilters(defaultFilters);
                  setModalVisible(false);
                }}
              >
                Clear
              </Button>
              <Button
                variant='primary'
                className='flex-1'
                onPress={() => handleSave()}
              >
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
