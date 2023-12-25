import React from 'react';
import CreateNote from '../components/CreateNote';
import MasonryGrid from '../components/MasonryGrid';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useSelector } from 'react-redux';

const Home = () => {
  const [elements, setElements] = React.useState([]);
  const status = useSelector((state) => state.notes.status);

  React.useEffect(() => {
    const fetchNotes = async () => {
      try {
        const collectionRef = collection(db, 'home');
        const snapShot = await getDocs(query(collectionRef, orderBy('timestamp', 'desc')));

        const data = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setElements(data);

        console.log('Перезагрузилась страница HOME');
        console.log('Статус: ', status);
      } catch (error) {
        console.error('Ошибка получения документа: ', error);
      }
    };

    fetchNotes();
  }, [status]);

  return (
    <div className="main page-home">
      <CreateNote />
      <MasonryGrid notes={{ elements }} />
    </div>
  );
};

export default Home;
