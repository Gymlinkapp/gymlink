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
    filter: 'intensity',
    name: 'Workout Intensity',
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

export const intensityValues = [
  {
    filter: 'intensity',
    name: 'Low',
    value: 'low',
  },
  {
    filter: 'intensity',
    name: 'Medium',
    value: 'medium',
  },
  {
    filter: 'intensity',
    name: 'High',
    value: 'high',
  },
];
