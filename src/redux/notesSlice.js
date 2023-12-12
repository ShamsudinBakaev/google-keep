import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  home: [],
  archive: [],
  trash: [],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote(state, action) {
      const { title, note } = action.payload;
      const id = Date.now();
      state.home.unshift({ id, title, note, pinned: false });
    },
    // Можно распространить функционал закрепления заметки и на страницу Archive. Если заметку, находящуюся в архиве, закрепить, то она переместится в home и закрепится вверху страницы.
    togglePin(state, action) {
      const noteId = action.payload;
      const noteToToggle = state.home.find((note) => note.id === noteId);

      if (noteToToggle) {
        noteToToggle.pinned = !noteToToggle.pinned;
      }
    },
    deleteNoteHome(state, action) {
      const noteId = action.payload;
      const noteToDelete = state.home.find((note) => note.id === noteId);

      if (noteToDelete && noteToDelete.pinned) {
        noteToDelete.pinned = false;
      }

      state.home = state.home.filter((note) => note.id !== noteId);
      state.trash.unshift(noteToDelete);
    },
    deleteNoteArchive(state, action) {
      const noteId = action.payload;
      const noteToDelete = state.archive.find((note) => note.id === noteId);
      state.archive = state.archive.filter((note) => note.id !== noteId);
      state.trash.unshift(noteToDelete);
    },
    deleteForever(state, action) {
      const noteId = action.payload;
      state.trash = state.trash.filter((note) => note.id !== noteId);
    },
    archive(state, action) {
      const noteId = action.payload;
      const noteToArchive = state.home.find((note) => note.id === noteId);

      if (noteToArchive && noteToArchive.pinned) {
        noteToArchive.pinned = false;
      }

      state.home = state.home.filter((note) => note.id !== noteId);
      state.archive.unshift(noteToArchive);
    },
    unarchive(state, action) {
      const noteId = action.payload;
      const noteToUnarchive = state.archive.find((note) => note.id === noteId);
      state.archive = state.archive.filter((note) => note.id !== noteId);
      state.home.unshift(noteToUnarchive);
    },
    restore(state, action) {
      const noteId = action.payload;
      const noteToRestore = state.trash.find((note) => note.id === noteId);
      state.trash = state.trash.filter((note) => note.id !== noteId);
      state.home.unshift(noteToRestore);
    },
  },
});

export const {
  createNote,
  togglePin,
  deleteNoteHome,
  deleteNoteArchive,
  deleteForever,
  archive,
  unarchive,
  restore,
} = notesSlice.actions;
export default notesSlice.reducer;
