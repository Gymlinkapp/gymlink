export type FilterValue = {
  name: string;
  value: string | boolean;
};

export type Filter = {
  filter: string;
  name?: string;
  values: FilterValue[];
};
