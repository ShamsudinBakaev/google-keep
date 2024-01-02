import React from 'react';
import MasonryGrid from '../components/MasonryGrid';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';

import { useSelector } from 'react-redux';

const Trash = () => {
  const [elements, setElements] = React.useState([]);
  const status = useSelector((state) => state.notes.status);

  React.useEffect(() => {
    const fetchNotes = async () => {
      try {
        const collectionRef = collection(db, 'trash');
        const snapShot = await getDocs(query(collectionRef, orderBy('timestamp', 'desc')));

        const data = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setElements(data);
      } catch (error) {
        console.error('Ошибка получения документа: ', error);
      }
    };

    fetchNotes();
  }, [status]);

  return (
    <div className="main page-trash">
      <MasonryGrid notes={{ elements }} />
    </div>
  );
};

export default Trash;
