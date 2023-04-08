import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShortPage } from '@/typings/page.type';

export type PagesState = {
  recentPages: ShortPage[];
  userPages: ShortPage[];
};

const initialState: PagesState = {
  recentPages: [],
  userPages: [],
};

export const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    updateRecentPages: (state, recentPages: PayloadAction<ShortPage[]>) => {
      state.recentPages = recentPages.payload;
    },
    updateUserPages: (state, pages: PayloadAction<ShortPage[]>) => {
      state.userPages = pages.payload;
    },
    removeFromPages: (state, uuid: PayloadAction<string>) => {
      state.recentPages = state.recentPages.filter((page) => page.uuid !== uuid.payload);
      state.userPages = state.userPages.filter((page) => page.uuid !== uuid.payload);
    },
  },
});

export const { updateRecentPages, updateUserPages, removeFromPages } = pagesSlice.actions;
export default pagesSlice.reducer;
