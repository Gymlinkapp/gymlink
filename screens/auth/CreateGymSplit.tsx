import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthLayout from "../../layouts/AuthLayout";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

type WeekSplit = {
  day: string;
  exercises: string[];
};

export default function CreateSplit({ navigation, route }) {
  console.log(route.params);
  const preSelectedSplits = [
    "Bro Split",
    "Push Pull Legs",
    "Upper Lower",
    "Full Body",
  ];
  const [selectedSplit, setSelectedSplit] = useState<string>(
    preSelectedSplits[0]
  );

  const [weekSplit, setWeekSplit] = useState<WeekSplit[]>([
    {
      day: "Monday",
      exercises: ["Chest"],
    },
    {
      day: "Tuesday",
      exercises: ["Back"],
    },
    {
      day: "Wednesday",
      exercises: ["Arms"],
    },
    {
      day: "Thursday",
      exercises: ["Rest"],
    },
    {
      day: "Friday",
      exercises: ["Legs"],
    },
    {
      day: "Saturday",
      exercises: ["Shoulders"],
    },
    {
      day: "Sunday",
      exercises: ["Abs"],
    },
  ]);

  const exercises = [
    "Chest",
    "Back",
    "Arms",
    "Legs",
    "Shoulders",
    "Abs",
    "Rest",
    "Cardio",
  ];

  return (
    <AuthLayout
      title="What is your current split."
      description="Fill out what you're hitting this week."
    >
      <View>
        {/* <LinearGradient
          colors={['rgba(0,0,0,0.75)', transparentWhite]}
          className='w-full h-full absolute top-0 left-0 z-30'
          start={[0.5, 0]}
          end={[0, 1]}

        /> */}
        <Text className="text-white mb-2 font-MontserratRegular">
          Already know you're split? Select it!
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {preSelectedSplits.map((split, idx) => (
            <TouchableOpacity
              onPress={() => setSelectedSplit(split)}
              className={`mr-1 ${
                selectedSplit === split ? "bg-primaryWhite" : "bg-secondaryDark"
              } px-4 py-2 rounded-full`}
              key={idx}
            >
              <Text
                className={`${
                  selectedSplit === split ? "text-primaryDark" : "text-white"
                } font-MontserratMedium`}
              >
                {split}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          className={`mt-1 ${
            selectedSplit === "Custom" ? "bg-primaryWhite" : "bg-secondaryDark"
          } px-4 py-2 rounded-full`}
          onPress={() => setSelectedSplit("Custom")}
        >
          <Text
            className={`${
              selectedSplit === "Custom" ? "text-primaryDark" : "text-white"
            } font-MontserratMedium text-center`}
          >
            Custom
          </Text>
        </TouchableOpacity>
      </View>

      {/* if custom is selected, show excercises to assign to days */}
      {selectedSplit === "Custom" && (
        <View>
          <Text className="text-white my-2 font-MontserratRegular">
            Choose your exercises. Tap and
          </Text>
          <View className="flex-row flex-wrap">
            {exercises.map((exercise, idx) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("AssignExcercise", {
                    exercise: exercise,
                  });
                }}
                key={idx}
                className="px-4 py-2 rounded-full bg-secondaryDark m-1"
              >
                <Text className="text-white">{exercise}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <ScrollView className="mt-12" showsVerticalScrollIndicator={false}>
        {weekSplit.map((day, idx) => (
          <View key={idx} className="mb-2 flex-row">
            <View className="bg-secondaryDark w-16 h-16 rounded-md justify-center items-center">
              <Text className="text-white font-MontserratBold">
                {day.day[0]}
              </Text>
            </View>
            <ScrollView
              horizontal
              className="ml-2 bg-secondaryDark rounded-md"
              contentContainerStyle={{
                alignItems: "center",
                paddingHorizontal: 8,
              }}
            >
              {day.exercises.map((exercise, idx) => (
                <TouchableOpacity
                  key={idx}
                  className="bg-primaryDark rounded-full px-6 py-4"
                >
                  <Text className="text-white">{exercise}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </AuthLayout>
  );
}
