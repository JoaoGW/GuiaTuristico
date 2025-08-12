let selectedTags: string[] = [];

/**
 * Updates the selected tags with the provided array of tags.
 *
 * @param tags - An array of strings representing the tags to be set as selected.
 */
export const utilsSetSelectedTags = (tags: string[]) => {
  selectedTags = tags;
};

/**
 * Retrieves the currently selected tags.
 *
 * @returns {string[]} An array of strings representing the selected tags.
 */
export const utilsGetSelectedTags = (): string[] => {
  return selectedTags;
};
