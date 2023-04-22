import { User } from './users';
export default function getMostRecentPrompt(user: User) {
  const lastPrompt = user.userPrompts.reduce((latest, current) => {
    return new Date(current.createdAt) > new Date(latest.createdAt)
      ? current
      : latest;
  });

  return lastPrompt;
}
