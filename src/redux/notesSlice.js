import { createSlice } from '@reduxjs/toolkit';

const notesSlice = createSlice({
  name: 'element',
  initialState: {
    status: 'idle', // Возможные значения: 'idle', 'loading', 'succeeded', 'failed'
  },
  reducers: {
    // Функция для редактирования заметки. В будущем планирую добавить такой функционал
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
