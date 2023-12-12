import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useSearch } from '../contexts/SearchContextProvider';

const Search = () => {
  const { searchResultsInHome, searchResultsInArchive, inputValue } = useSearch();
  // const dispatch = useDispatch();
  // const location = useLocation();
  // const currentPage = location.pathname;

  // const handlePinNote = (id) => {
  //   dispatch(togglePin(id));
  // };
  // const handleArchive = (id) => {
  //   dispatch(archive(id));
  // };
  // const handleUnarchive = (id) => {
  //   dispatch(unarchive(id));
  // };
  // const handleDeleteNote = (currentPage, id) => {
  //   if (currentPage === '/') {
  //     dispatch(deleteNoteHome(id));
  //   } else if (currentPage === '/archive') {
  //     dispatch(deleteNoteArchive(id));
  //   }
  // };

  return (
    <div className="main page-search">
      <div className="component-masonry-grid">
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
                        {/* <img
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
                          onClick={() => handleDeleteNote(currentPage, elem.id)}
                          title="Delete"
                        /> */}
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
                        {/* <img
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
                        /> */}
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
            <p>Ничего не найдено</p>
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
