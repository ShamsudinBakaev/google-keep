import React from 'react';
import MasonryGrid from '../components/MasonryGrid';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';

const Archive = () => {
  const [elements, setElements] = React.useState([]);

  React.useEffect(() => {
    const fetchNotes = async () => {
      try {
        const collectionRef = collection(db, 'archive');
        const snapShot = await getDocs(query(collectionRef, orderBy('timestamp', 'desc')));

        const data = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setElements(data);
      } catch (error) {
        console.error('Ошибка получения документа: ', error);
      }
    };

    fetchNotes();
  }, [elements]);

  return (
    <div className="main page-archive">
      <MasonryGrid notes={{ elements }} />
    </div>
  );
};

export default Archive;
