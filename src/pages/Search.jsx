import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useSearch } from '../contexts/SearchContextProvider';

import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

import { useDispatch } from 'react-redux';
import { setStatus } from '../redux/notesSlice';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Search = () => {
  const { searchResultsInHome, searchResultsInArchive, inputValue } = useSearch();
  const dispatch = useDispatch();

  const successToast = (message) => {
    toast.success(message);
  };
  const errorToast = (message) => {
    toast.error(message);
  };

  const handlePinNoteInHome = async (id) => {
    try {
      dispatch(setStatus('loading'));
      successToast('Success');

      const noteRef = doc(db, 'home', id);
      const noteDoc = await getDoc(noteRef);

      if (noteDoc.exists()) {
        await updateDoc(noteRef, {
          pinned: !noteDoc.data().pinned,
        });

        dispatch(setStatus('succeeded'));
      }
    } catch (e) {
      dispatch(setStatus('failed'));
      errorToast('Error');
      console.error('Error: ', e);
    }
  };
  const handlePinNoteInArchive = async (id) => {
    try {
      dispatch(setStatus('loading'));
      successToast('Success');

      const archiveNoteRef = doc(db, 'archive', id);
      const archiveNoteDoc = await getDoc(archiveNoteRef);

      if (archiveNoteDoc.exists()) {
        const { title, note, timestamp } = archiveNoteDoc.data();

        const updatedData = {
          title,
          note,
          pinned: true,
          timestamp,
        };

        const homeNoteRef = doc(db, 'home', id);

        await setDoc(homeNoteRef, updatedData);
        await deleteDoc(archiveNoteRef);

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

  const handleDeleteNoteFromHome = async (id) => {
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
  const handleDeleteNoteFromArchive = async (id) => {
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

  return (
    <div className="main page-search">
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
        {searchResultsInHome.length > 0 || searchResultsInArchive.length > 0 ? (
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
            <Masonry>
              {searchResultsInHome.map((elem) => (
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
                          onClick={() => handlePinNoteInHome(elem.id)}
                          title={elem.pinned ? 'Unpin a note' : 'Pin a note'}
                        />
                        <img
                          className="archive"
                          src="/control-panel/archive.svg"
                          alt=""
                          onClick={() => handleArchive(elem.id)}
                          title="Archive"
                        />
                        <img
                          className="delete-note"
                          src="/control-panel/delete-note.svg"
                          alt=""
                          onClick={() => handleDeleteNoteFromHome(elem.id)}
                          title="Delete"
                        />
                      </div>

                      <div className="block-right">{/* <button>Close</button> */}</div>
                    </div>
                  </div>
                </div>
              ))}
            </Masonry>

            <p className="pinned-others-title">{searchResultsInArchive.length > 0 && 'Archive'}</p>

            <Masonry>
              {searchResultsInArchive.map((elem) => (
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
                          onClick={() => handlePinNoteInArchive(elem.id)}
                          title={elem.pinned ? 'Unpin a note' : 'Pin a note'}
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
                          onClick={() => handleDeleteNoteFromArchive(elem.id)}
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
        ) : inputValue.length >= 1 ? (
          <div className="special-element first">
            <p>Nothing found</p>
          </div>
        ) : (
          <div className="special-element first">
            <img src="/header/search.svg" alt="" />
            <p>Enter a query to search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
