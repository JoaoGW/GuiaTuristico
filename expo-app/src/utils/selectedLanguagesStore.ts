let selectedLanguages: string[] = [];

/**
 * Updates the selected tags with the provided array of tags.
 *
 * @param languages - An array of strings representing the tags to be set as selected.
 */
export const utilsSetSelectedLanguages = (languages: string[]) => {
  selectedLanguages = languages;
};

/**
 * Retrieves the currently selected tags.
 *
 * @returns {string[]} An array of strings representing the selected tags.
 */
export const utilsGetSelectedLanguages = (): string[] => {
  return selectedLanguages;
};
