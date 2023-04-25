export const transformTag = (tag: string) => {
  if (!tag || typeof tag !== 'string') return '';
  const words = tag.split('-');
  const transformedWords = words.map((word) => {
    return word[0].toUpperCase() + word.slice(1);
  });
  return transformedWords.join(' ');
};
