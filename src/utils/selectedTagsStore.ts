let selectedTags: string[] = [];

export const utilsSetSelectedTags = (tags: string[]) => {
  selectedTags = tags;
};

export const utilsGetSelectedTags = (): string[] => {
  return selectedTags;
};
