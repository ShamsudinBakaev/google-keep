import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

import { useDispatch } from 'react-redux';
import { setStatus } from '../redux/notesSlice';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MasonryGrid = ({ notes }) => {
  const location = useLocation();
  const currentPage = location.pathname;
  const { elements } = notes;
  const pinnedNotes = elements.filter((elem) => elem.pinned);
  const unpinnedNotes = elements.filter((elem) => !elem.pinned);
  const dispatch = useDispatch();

  const successToast = (message) => {
    toast.success(message);
  };
  const errorToast = (message) => {
    toast.error(message);
  };

  const handlePinNote = async (id) => {
    try {
      dispatch(setStatus('loading'));
      successToast('Success');

      const noteRef = doc(db, currentPage === '/' ? 'home' : 'archive', id);
      const noteDoc = await getDoc(noteRef);

      if (noteDoc.exists()) {
        const { title, note, pinned, timestamp } = noteDoc.data();
        await updateDoc(noteRef, {
          pinned: !pinned,
        });

        if (currentPage === '/archive') {
          const homeNoteRef = doc(db, 'home', id);
          await setDoc(homeNoteRef, {
            title,
            note,
            pinned: !pinned,
            timestamp,
          });

          await deleteDoc(noteRef);
        }

        dispatch(setStatus('succeeded'));
      }
    } catch (e) {
      dispatch(setStatus('failed'));
      errorToast('Error');
      console.error('Error: ', e);
    }
  };
  const handleArchive = async (id) => {
    try {
      dispatch(setStatus('loading'));
      successToast('Note archived');

      const homeNoteRef = doc(db, 'home', id);
      const homeNoteDoc = await getDoc(homeNoteRef);

      if (homeNoteDoc.exists()) {
        const { title, note, pinned, timestamp } = homeNoteDoc.data();
        const archiveNoteRef = doc(db, 'archive', id);

        await setDoc(archiveNoteRef, {
          title,
          note,
          pinned: pinned ? false : pinned,
          timestamp,
        });

        await deleteDoc(homeNoteRef);
        dispatch(setStatus('succeeded'));
      }
    } catch (e) {
      dispatch(setStatus('failed'));
      errorToast('Archiving error');
      console.error('Archiving error: ', e);
    }
  };
  const handleUnarchive = async (id) => {
    try {
      dispatch(setStatus('loading'));
      successToast('Note unarchived');

      const archiveNoteRef = doc(db, 'archive', id);
      const archiveNoteDoc = await getDoc(archiveNoteRef);

      if (archiveNoteDoc.exists()) {
        const { title, note, pinned, timestamp } = archiveNoteDoc.data();
        const homeNoteRef = doc(db, 'home', id);

        await setDoc(homeNoteRef, {
          title,
          note,
          pinned,
          timestamp,
        });

        await deleteDoc(archiveNoteRef);
        dispatch(setStatus('succeeded'));
      }
    } catch (e) {
      dispatch(setStatus('failed'));
      errorToast('Unarchiving error');
      console.error('Unarchiving error: ', e);
    }
  };
  const handleDeleteForever = async (id) => {
    try {
      dispatch(setStatus('loading'));
      successToast('Note deleted forever');

      const trashNoteRef = doc(db, 'trash', id);

      await deleteDoc(trashNoteRef);
      dispatch(setStatus('succeeded'));
    } catch (e) {
      dispatch(setStatus('failed'));
      errorToast('Permanent deletion error');
      console.error('Permanent deletion error: ', e);
    }
  };
  const handleRestore = async (id) => {
    try {
      dispatch(setStatus('loading'));
      successToast('Note restored');

      const trashNoteRef = doc(db, 'trash', id);
      const trashNoteDoc = await getDoc(trashNoteRef);

      if (trashNoteDoc.exists()) {
        const { title, note, pinned, timestamp } = trashNoteDoc.data();
        const homeNoteRef = doc(db, 'home', id);

        await setDoc(homeNoteRef, {
          title,
          note,
          pinned,
          timestamp,
        });

        await deleteDoc(trashNoteRef);
        dispatch(setStatus('succeeded'));
      }
    } catch (e) {
      dispatch(setStatus('failed'));
      errorToast('Restore error');
      console.error('Restore error: ', e);
    }
  };

  const deleteNoteHome = async (id) => {
    try {
      dispatch(setStatus('loading'));
      successToast('Note deleted');

      const noteRef = doc(db, 'home', id);
      const noteDoc = await getDoc(noteRef);

      if (noteDoc.exists()) {
        const { title, note, pinned, timestamp } = noteDoc.data();
        const trashNoteRef = doc(db, 'trash', id);

        await setDoc(trashNoteRef, {
          title,
          note,
          pinned: pinned ? false : pinned,
          timestamp,
        });

        await deleteDoc(noteRef);
        dispatch(setStatus('succeeded'));
      }
    } catch (e) {
      dispatch(setStatus('failed'));
      errorToast('Delete error');
      console.error('Delete error: ', e);
    }
  };
  const deleteNoteArchive = async (id) => {
    try {
      dispatch(setStatus('loading'));
      successToast('Note deleted');

      const noteRef = doc(db, 'archive', id);
      const noteDoc = await getDoc(noteRef);

      if (noteDoc.exists()) {
        const { title, note, pinned, timestamp } = noteDoc.data();
        const trashNoteRef = doc(db, 'trash', id);

        await setDoc(trashNoteRef, {
          title,
          note,
          pinned,
          timestamp,
        });

        await deleteDoc(noteRef);
        dispatch(setStatus('succeeded'));
      }
    } catch (e) {
      dispatch(setStatus('failed'));
      errorToast('Delete error');
      console.error('Delete error: ', e);
    }
  };

  const handleDeleteNote = async (id) => {
    if (currentPage === '/') {
      deleteNoteHome(id);
    } else if (currentPage === '/archive') {
      deleteNoteArchive(id);
    }
  };

  return (
    <div className="component-masonry-grid">
      {/* Function execution status message */}
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Masonry-grid */}
      {elements.length > 0 ? (
        <ResponsiveMasonry
          className="masonry-grid-item"
          columnsCountBreakPoints={{
            // +15px; +80px;
            345: 1,
            610: 2,
            875: 3,
            1140: 4,
            1405: 5,
            1670: 6,
            1935: 7,
            2200: 8,
            2465: 9,
            2730: 10,
          }}>
          <p className="pinned-others-title">{pinnedNotes.length > 0 && 'Pinned'}</p>
          <Masonry>
            {pinnedNotes.map((elem) => (
              <div className="card" key={elem.id}>
                <div className="content">
                  {elem.title.length > 1 || elem.note.length > 1 ? (
                    <>
                      {elem.title.length > 1 && <div className="title">{elem.title}</div>}
                      {elem.note.length > 1 && <div className="note">{elem.note}</div>}
                    </>
                  ) : (
                    <div className="note">Empty note</div>
                  )}
                </div>

                <div className="control-panel">
                  <div className="top">
                    <img
                      className="select-note"
                      src="/control-panel/select-note.svg"
                      alt=""
                      title="Select note"
                    />
                  </div>

                  <div className="bottom">
                    <div className="block-left">
                      <img
                        className="pin"
                        src={
                          elem.pinned
                            ? '/control-panel/note-is-pinned.svg'
                            : '/control-panel/note-is-not-pinned.svg'
                        }
                        alt=""
                        onClick={() => handlePinNote(elem.id)}
                        title={elem.pinned ? 'Unpin a note' : 'Pin a note'}
                      />
                      <img
                        className="delete-forever"
                        src="/control-panel/delete-forever.svg"
                        alt=""
                        onClick={() => handleDeleteForever(elem.id)}
                        title="Delete forever"
                      />
                      <img
                        className="restore"
                        src="/control-panel/restore.svg"
                        alt=""
                        onClick={() => handleRestore(elem.id)}
                        title="Restore"
                      />
                      <img
                        className="archive"
                        src="/control-panel/archive.svg"
                        alt=""
                        onClick={() => handleArchive(elem.id)}
                        title="Archive"
                      />
                      <img
                        className="unarchive"
                        src="/control-panel/unarchive.svg"
                        alt=""
                        onClick={() => handleUnarchive(elem.id)}
                        title="Unarchive"
                      />
                      <img
                        className="delete-note"
                        src="/control-panel/delete-note.svg"
                        alt=""
                        onClick={() => handleDeleteNote(elem.id)}
                        title="Delete"
                      />
                    </div>

                    <div className="block-right">{/* <button>Close</button> */}</div>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
          <p className="pinned-others-title">
            {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && 'Others'}
          </p>
          <Masonry>
            {unpinnedNotes.map((elem) => (
              <div className="card" key={elem.id}>
                <div className="content">
                  {elem.title.length > 1 || elem.note.length > 1 ? (
                    <>
                      {elem.title.length > 1 && <div className="title">{elem.title}</div>}
                      {elem.note.length > 1 && <div className="note">{elem.note}</div>}
                    </>
                  ) : (
                    <div className="note">Empty note</div>
                  )}
                </div>

                <div className="control-panel">
                  <div className="top">
                    <img
                      className="select-note"
                      src="/control-panel/select-note.svg"
                      alt=""
                      title="Select note"
                    />
                  </div>

                  <div className="bottom">
                    <div className="block-left">
                      <img
                        className="pin"
                        src={
                          elem.pinned
                            ? '/control-panel/note-is-pinned.svg'
                            : '/control-panel/note-is-not-pinned.svg'
                        }
                        alt=""
                        onClick={() => handlePinNote(elem.id)}
                        title={elem.pinned ? 'Unpin a note' : 'Pin a note'}
                      />
                      <img
                        className="delete-forever"
                        src="/control-panel/delete-forever.svg"
                        alt=""
                        onClick={() => handleDeleteForever(elem.id)}
                        title="Delete forever"
                      />
                      <img
                        className="restore"
                        src="/control-panel/restore.svg"
                        alt=""
                        onClick={() => handleRestore(elem.id)}
                        title="Restore"
                      />
                      <img
                        className="archive"
                        src="/control-panel/archive.svg"
                        alt=""
                        onClick={() => handleArchive(elem.id)}
                        title="Archive"
                      />
                      <img
                        className="unarchive"
                        src="/control-panel/unarchive.svg"
                        alt=""
                        onClick={() => handleUnarchive(elem.id)}
                        title="Unarchive"
                      />
                      <img
                        className="delete-note"
                        src="/control-panel/delete-note.svg"
                        alt=""
                        onClick={() => handleDeleteNote(elem.id)}
                        title="Delete"
                      />
                    </div>

                    <div className="block-right">{/* <button>Close</button> */}</div>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      ) : (
        <>
          {currentPage === '/' && (
            <div className="special-element first">
              <img src="/sidebar/notes.svg" alt="" />
              <p>Your notes will be here</p>
            </div>
          )}
          {currentPage === '/archive' && (
            <div className="special-element first">
              <img src="/sidebar/archive.svg" alt="" />
              <p>Archived notes will be stored here</p>
            </div>
          )}
          {currentPage === '/trash' && (
            <div className="special-element first">
              <img src="/sidebar/trash.svg" alt="" />
              <p>There is nothing in the cart</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

MasonryGrid.propTypes = {
  notes: PropTypes.object.isRequired,
};

export default MasonryGrid;
