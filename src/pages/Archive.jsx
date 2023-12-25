import React from 'react';
import MasonryGrid from '../components/MasonryGrid';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';

import { useDispatch, useSelector } from 'react-redux';
import { setStatus } from '../redux/notesSlice';

const Archive = () => {
  const [elements, setElements] = React.useState([]);

  const status = useSelector((state) => state.notes.status);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchNotes = async () => {
      try {
        dispatch(setStatus('loading'));

        const collectionRef = collection(db, 'archive');
        const snapShot = await getDocs(query(collectionRef, orderBy('timestamp', 'desc')));

        const data = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setElements(data);

        dispatch(setStatus('succeeded'));

        console.log('Перезагрузилась страница ARCHIVE');
      } catch (error) {
        dispatch(setStatus('failed'));

        console.error('Ошибка получения документа: ', error);
      }
    };

    fetchNotes();
  }, [dispatch]);

  return (
    <div className="main page-archive">
      <MasonryGrid notes={{ elements }} />
    </div>
  );
};

export default Archive;
