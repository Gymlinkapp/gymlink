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
    values: [
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
    ],
  },
  {
    filter: 'workoutType',
    name: 'Workout Type',
    values: [
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
    ],
  },
  {
    filter: 'intensity',
    name: 'Workout Intensity',
    values: [
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
    ],
  },
  {
    filter: 'intensityyy',
    name: 'Workout Intensity',
    values: [
      {
        filter: 'intensityyy',
        name: 'Low',
        value: 'low',
      },
      {
        filter: 'intensityyy',
        name: 'Medium',
        value: 'medium',
      },
      {
        filter: 'intensityyy',
        name: 'High',
        value: 'high',
      },
    ],
  },
];
