import { configureStore } from '@reduxjs/toolkit';
import element from './notesSlice';

const store = configureStore({
  reducer: element,
});

export default store;
