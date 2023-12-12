import React from 'react';
import Fuse from 'fuse.js';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const SearchContext = React.createContext();

// ДАЛЕЕ НУЖНО ВАЛИДИРОВАТЬ ПРОПСЫ

// eslint-disable-next-line react/prop-types
export const SearchContextProvider = ({ children }) => {
  const [searchResultsInHome, setSearchResultsInHome] = React.useState([]);
  const [searchResultsInArchive, setSearchResultsInArchive] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const location = useLocation();

  const homeNotesArray = useSelector((state) => state.home);
  const archiveNotesArray = useSelector((state) => state.archive);

  React.useEffect(() => {
    setInputValue('');
    setSearchResultsInHome([]);
    setSearchResultsInArchive([]);
  }, [location.pathname]);

  const options = {
    includeScore: true,
    includeMatches: true,
    threshold: 0.4,
    keys: ['title', 'note'],
  };

  const homeFuse = new Fuse(homeNotesArray, options);
  const archiveFuse = new Fuse(archiveNotesArray, options);

  const handleSearch = (event) => {
    const { value } = event.target;
    setInputValue(value);

    if (value.length < 1) {
      setSearchResultsInHome([]);
      setSearchResultsInArchive([]);
    } else {
      const homeResults = homeFuse.search(value);
      const homeItems = homeResults.map((results) => results.item);
      setSearchResultsInHome(homeItems);

      const archiveResults = archiveFuse.search(value);
      const archiveItems = archiveResults.map((result) => result.item);
      setSearchResultsInArchive(archiveItems);
    }
  };

  return (
    <SearchContext.Provider
      value={{ searchResultsInHome, searchResultsInArchive, inputValue, handleSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchContextProvider');
  }
  return context;
};
