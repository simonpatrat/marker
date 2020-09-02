export const getDateString = (entry: string): string => {
  const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = /[0-9]{10}/.test(entry) ? new Date(parseInt(entry) * 1000) : new Date(entry);
  return date.toLocaleDateString('fr-FR', formatOptions);
};
