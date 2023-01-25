export type User = {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  age: number;
  bio: string | null;
  images: string[];
  tags: string[];
  longitude: number | null;
  latitude: number | null;
  tempJWT: string | null;
  verificationCode: string | null;
  verified: boolean | null;
  gymId: string;
  createdAt: Date;
  updatedAt: Date;
  chatId: string | null;
  authSteps: number;
};

export const AUTH_STEPS = 7;
