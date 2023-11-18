import { configureStore } from '@reduxjs/toolkit';
import notes from './notesSlice';

const store = configureStore({
  reducer: notes,
});

export default store;
