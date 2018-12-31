/**
 * Removes new line characters and trailing whitespace
 * @param text
 */
export const strip = (text: string): string => {
  if(text === null || text === undefined || text === "") return text;

  return text
          .replace('\n', '',)
          .trim();
};