function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

// This is ugly, but I do not have need of a datetime library yet...
export const getMaxDateSelect = (): string => {
  const twoDaysFromNow = new Date(new Date().getTime() + 48 * 60000);
  return twoDaysFromNow.toISOString().split('T')[0]
}
