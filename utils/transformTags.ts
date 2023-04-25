export const transformTag = (tag: string) => {
  const words = tag.split('-');
  const transformedWords = words.map((word) => {
    return word[0].toUpperCase() + word.slice(1);
  });
  return transformedWords.join(' ');
};
