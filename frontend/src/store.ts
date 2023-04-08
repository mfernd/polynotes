import { configureStore } from '@reduxjs/toolkit';
import editorReducer from '@/features/editorSlice';
import pagesReducer from '@/features/pagesSlice';

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    pages: pagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
