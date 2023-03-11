export const shouldShowPlaceholder = (
  defaultShowPlaceholder?: boolean,
  isFocused?: boolean,
  isEmpty?: boolean,
): boolean => (defaultShowPlaceholder && !isFocused && isEmpty) || !!(isFocused && isEmpty);