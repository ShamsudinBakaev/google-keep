// Redux временно отключен от проекта за ненадобностью, но в будущем планируется функционал, для работы которого пригодится Redux

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '',
  note: '',
};

const notesSlice = createSlice({
  name: 'element',
  initialState,
  reducers: {
    // Эта функция предназначается для редактирования конкретной заметки
    editNote(state, action) {
      console.log(state, action);
    },
  },
});

export const { editNote } = notesSlice.actions;
export default notesSlice.reducer;
