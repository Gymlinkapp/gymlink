export type User = {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  age: number;
  bio: string | null;
  gender: string | null;
  race: string | null;
  images: string[];
  tags: string[];
  longitude: number | null;
  latitude: number | null;
  authSteps: number;
  isBot: boolean;
  filterGoingToday: boolean;
  filterWorkout: string[];
  filterSkillLevel: string[];
  filterGender: string[];
  filterGoals: string[];
  streak: number;
  tempJWT: string | null;
  verificationCode: string | null;
  verified: boolean | null;
  gymId: string | null;
  createdAt: Date;
  updatedAt: Date;
  chatId: string | null;
  splitId: string | null;
  userId: string | null;
  userPrompts: UserPrompt[];
  gym: {
    name: string;
  };
};

export type Split = {
  id: string;
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
  User: User;
};

export type UserPrompt = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  answer: string;
  prompt: {
    prompt: string;
  };
  hasAnswered: boolean;
  promptId: string;
};

export const AUTH_STEPS = 7;
