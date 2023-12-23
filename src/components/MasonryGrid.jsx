import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const MasonryGrid = ({ notes }) => {
  const location = useLocation();
  const currentPage = location.pathname;
  const { elements } = notes;
  const pinnedNotes = elements.filter((elem) => elem.pinned);
  const unpinnedNotes = elements.filter((elem) => !elem.pinned);

  // переписываю функционал, интегрирую с firebase:
  const handlePinNote = async (id) => {
    try {
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

        console.log('Заметка успешно изменена.');
      } else {
        console.error('Заметка не найдена.');
      }
    } catch (e) {
      console.error('Ошибка при изменении заметки: ', e);
    }
  };
  const handleArchive = async (id) => {
    try {
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

        console.log('Заметка успешно перемещена в архив');
      } else {
        console.error('Заметка не найдена в коллекции home');
      }
    } catch (e) {
      console.error('Ошибка при архивации заметки: ', e);
    }
  };
  const handleUnarchive = async (id) => {
    try {
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

        console.log('Заметка успешно перемещена в архив');
      } else {
        console.error('Заметка не найдена в коллекции archive');
      }
    } catch (e) {
      console.error('Ошибка при разархивации заметки: ', e);
    }
  };
  // далее идут 2 функции: 1)удаляет заметку из home; 2)удаляет заметку из archive
  // в зависимости от текущей страницы? handleDeleteNote будет запускать соответствующую функцию
  const deleteNoteHome = async (id) => {
    try {
      const noteRef = doc(db, 'home', id);
      const noteDoc = await getDoc(noteRef);

      if (noteDoc.exists()) {
        const trashNoteRef = doc(db, 'trash', id);
        const { title, note, pinned, timestamp } = noteDoc.data();

        await setDoc(trashNoteRef, {
          title,
          note,
          pinned: pinned ? false : pinned,
          timestamp,
        });

        await deleteDoc(noteRef);

        console.log('Заметка успешно перемещена в корзину');
      } else {
        console.error('Заметка не найдена в коллекции home');
      }
    } catch (e) {
      console.error('Ошибка при удалении заметки из коллекции home: ', e);
    }
  };
  const deleteNoteArchive = async (id) => {
    try {
      const noteRef = doc(db, 'archive', id);
      const noteDoc = await getDoc(noteRef);

      if (noteDoc.exists()) {
        const trashNoteRef = doc(db, 'trash', id);
        const { title, note, pinned, timestamp } = noteDoc.data();

        await setDoc(trashNoteRef, {
          title,
          note,
          pinned: pinned ? fasle : pinned,
          timestamp,
        });

        await deleteDoc(noteRef);

        console.log('Заметка успешно перемещена в корзину');
      } else {
        console.error('Заметка не найдена в коллекции archive');
      }
    } catch (e) {
      console.error('Ошибка при удалении заметки из коллекции archive: ', e);
    }
  };
  const handleDeleteNote = async (currentPage, id) => {
    if (currentPage === '/') {
      deleteNoteHome(id);
    } else if (currentPage === '/archive') {
      deleteNoteArchive(id);
    }
  };
  const handleDeleteForever = (id) => {
    // Функцию предстоит написать, пока-что это просто заглушка
    console.log(id);
  };
  const handleRestore = async (id) => {
    try {
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

        console.log('Заметка успешно восстановлена');
      } else {
        console.error('Заметка не найдена в коллекции trash');
      }
    } catch (e) {
      console.error('Ошибка при восстановлении заметки: ', e);
    }
  };

  return (
    <div className="component-masonry-grid">
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
                        onClick={() => handleDeleteNote(currentPage, elem.id)}
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
        // Можно для каждой страницы сделать специальную картинку с надписью
        <div className="special-element first">
          <img src="/sidebar/notes.svg" alt="" />
          <p>Your notes will be here</p>
        </div>
      )}
    </div>
  );
};

MasonryGrid.propTypes = {
  notes: PropTypes.object.isRequired,
};

export default MasonryGrid;
