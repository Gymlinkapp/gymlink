export type User = {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  age: number;
  bio: string | null;
  images: string[];
  tags: string[];
  tempJWT: string | null;
  verificationCode: string | null;
  verified: boolean | null;
  gymId: string;
  createdAt: Date;
  updatedAt: Date;
};
