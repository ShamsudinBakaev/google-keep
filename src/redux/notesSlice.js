// Redux временно отключен от проекта за ненадобностью, но в будущем планируется функционал, для работы которого пригодится Redux

import { createSlice } from '@reduxjs/toolkit';

const notesSlice = createSlice({
  name: 'element',
  initialState: {
    status: 'idle', // Возможные значения: 'idle', 'loading', 'succeeded', 'failed'
  },
  reducers: {
    // Эта функция предназначается для редактирования конкретной заметки
    editNote(state, action) {
      console.log(state, action);
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { editNote, setStatus } = notesSlice.actions;
export default notesSlice.reducer;
