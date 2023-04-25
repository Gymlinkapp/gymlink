export function DisplayGymName(location: string): string {
  // Use a regex pattern to match the name followed by a comma or a hyphen
  const pattern = /^(.+?)(?:\s*[,-]\s*|$)/;
  const match = location.match(pattern);

  // If a match is found, return the name; otherwise, return the original string
  return match ? match[1] : location;
}
