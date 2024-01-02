import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Fuse from 'fuse.js';

import { db } from '../services/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const SearchContext = React.createContext();

// ДАЛЕЕ НУЖНО ВАЛИДИРОВАТЬ ПРОПСЫ

// eslint-disable-next-line react/prop-types
export const SearchContextProvider = ({ children }) => {
  const [allHomeNotes, setAllHomeNotes] = React.useState([]);
  const [allArchiveNotes, setAllArchiveNotes] = React.useState([]);

  const [searchResultsInHome, setSearchResultsInHome] = React.useState([]);
  const [searchResultsInArchive, setSearchResultsInArchive] = React.useState([]);

  const [inputValue, setInputValue] = React.useState('');

  const status = useSelector((state) => state.notes.status);

  const location = useLocation();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const homeCollectionRef = collection(db, 'home');
        const homeSnapshot = await getDocs(query(homeCollectionRef, orderBy('timestamp', 'desc')));
        const homeData = homeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const archiveCollectionRef = collection(db, 'archive');
        const archiveSnapshot = await getDocs(
          query(archiveCollectionRef, orderBy('timestamp', 'desc')),
        );
        const archiveData = archiveSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setAllHomeNotes(homeData);
        setAllArchiveNotes(archiveData);
      } catch (error) {
        console.error('Ошибка получения данных: ', error);
      }
    };

    fetchData();
  }, [status]);

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

  const homeFuse = new Fuse(allHomeNotes, options);
  const archiveFuse = new Fuse(allArchiveNotes, options);

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
