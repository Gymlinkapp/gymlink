export type FilterValue = {
  filter?: string;
  name: string;
  value: string | boolean;
};

export type Filter = {
  filter: string;
  name?: string;
  values: FilterValue[];
};

export const defaultFilters: Filter[] = [
  {
    filter: 'goingToday',
    name: 'Going Today',
    values: [],
  },
  {
    filter: 'workoutType',
    name: 'Workout Type',
    values: [],
  },
  {
    filter: 'skillLevel',
    name: 'Workout Skill Level',
    values: [],
  },
  {
    filter: 'gender',
    name: 'Gender',
    values: [],
  },
  {
    filter: 'goals',
    name: 'Goals',
    values: [],
  },
];

export const goingTodayValues = [
  {
    filter: 'goingToday',
    name: 'Yes',
    value: true,
  },
  {
    filter: 'goingToday',
    name: 'No',
    value: false,
  },
];

export const workoutTypeValues = [
  {
    filter: 'workoutType',
    name: 'Cardio',
    value: 'cardio',
  },
  {
    filter: 'workoutType',
    name: 'Bench',
    value: 'bench',
  },
  {
    filter: 'workoutType',
    name: 'Squat',
    value: 'squat',
  },
];

export const skillLevelValues = [
  {
    filter: 'skillLevel',
    name: 'Low',
    value: 'low',
  },
  {
    filter: 'skillLevel',
    name: 'Medium',
    value: 'medium',
  },
  {
    filter: 'skillLevel',
    name: 'High',
    value: 'high',
  },
];

export const genderValues = [
  {
    filter: 'gender',
    name: 'Male',
    value: 'male',
  },
  {
    filter: 'gender',
    name: 'Female',
    value: 'female',
  },
];
export const goalValues = [
  {
    filter: 'goals',
    name: 'Weight Loss',
    value: 'weightLoss',
  },
  {
    filter: 'goals',
    name: 'Muscle Gain',
    value: 'muscleGain',
  },
  {
    filter: 'goals',
    name: 'Toning',
    value: 'toning',
  },
];
