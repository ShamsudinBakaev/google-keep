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
  unarchive,
} from '../redux/notesSlice';

const MasonryGrid = ({ notes }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPage = location.pathname;
  const { elements } = notes;

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
  const handleArchive = (id) => {
    dispatch(archive(id));
  };
  const handleUnarchive = (id) => {
    dispatch(unarchive(id));
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
          <Masonry>
            {elements.map((elem) => (
              <div className="card" key={elem.id}>
                <div className="content">
                  {elem.title || elem.note ? (
                    <>
                      <p className="title">{elem.title}</p>
                      <p className="note">{elem.note}</p>
                    </>
                  ) : (
                    <p className="empty-note">Empty note</p>
                  )}
                </div>

                <div className="control-panel">
                  <div className="top">
                    <img className="select-note" src="/control-panel/select-note.svg" alt="" />
                  </div>

                  <div className="bottom">
                    <div className="block-left">
                      <img className="fixation" src="/control-panel/fixation.svg" alt="" />
                      <img
                        className="restore"
                        src="/control-panel/restore.svg"
                        alt=""
                        onClick={() => handleRestore(elem.id)}
                      />
                      <img
                        className="delete-forever"
                        src="/control-panel/delete-forever.svg"
                        alt=""
                        onClick={() => handleDeleteForever(elem.id)}
                      />
                      <img
                        className="archive"
                        src="/control-panel/archive.svg"
                        alt=""
                        onClick={() => handleArchive(elem.id)}
                      />
                      <img
                        className="unarchive"
                        src="/control-panel/unarchive.svg"
                        alt=""
                        onClick={() => handleUnarchive(elem.id)}
                      />
                      <img
                        className="delete-note"
                        src="/control-panel/delete-note.svg"
                        alt=""
                        onClick={() => handleDeleteNote(currentPage, elem.id)}
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
  notes: PropTypes.array.isRequired,
};

export default MasonryGrid;
