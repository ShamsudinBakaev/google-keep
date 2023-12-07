import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  archive,
  deleteForever,
  deleteNoteArchive,
  deleteNoteHome,
  restore,
  togglePin,
  unarchive,
} from '../redux/notesSlice';

const MasonryGrid = ({ notes }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPage = location.pathname;
  const { elements } = notes;
  const pinnedNotes = elements.filter((elem) => elem.pinned);
  const unpinnedNotes = elements.filter((elem) => !elem.pinned);

  const handlePinNote = (id) => {
    dispatch(togglePin(id));
  };
  const handleArchive = (id) => {
    dispatch(archive(id));
  };
  const handleUnarchive = (id) => {
    dispatch(unarchive(id));
  };
  const handleDeleteNote = (currentPage, id) => {
    if (currentPage === '/') {
      dispatch(deleteNoteHome(id));
    } else if (currentPage === '/archive') {
      dispatch(deleteNoteArchive(id));
    }
  };
  const handleDeleteForever = (id) => {
    dispatch(deleteForever(id));
  };
  const handleRestore = (id) => {
    dispatch(restore(id));
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
                  {elem.title || elem.note ? (
                    <>
                      <div className="title">{elem.title}</div>
                      <div className="note">{elem.note}</div>
                    </>
                  ) : (
                    // <div className="empty-note">Empty note</div>
                    <div className="note">{elem.note || 'Empty note'}</div>
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
          <p className="pinned-others-title">
            {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && 'Others'}
          </p>
          <Masonry>
            {unpinnedNotes.map((elem) => (
              <div className="card" key={elem.id}>
                <div className="content">
                  {elem.title || elem.note ? (
                    <>
                      <div className="title">{elem.title}</div>
                      <div className="note">{elem.note}</div>
                    </>
                  ) : (
                    // <div className="empty-note">Empty note</div>
                    <div className="note">{elem.note || 'Empty note'}</div>
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
        <div className="notes-empty-page">
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
