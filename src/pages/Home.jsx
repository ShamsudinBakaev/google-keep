import React from 'react';
import CreateNote from '../components/CreateNote';
import MasonryGrid from '../components/MasonryGrid';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setStatus } from '../redux/notesSlice';

const Home = () => {
  const [elements, setElements] = React.useState([]);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.notes.status);
  console.log('Статус: ', status);

  React.useEffect(() => {
    const fetchNotes = async () => {
      try {
        dispatch(setStatus('loading'));

        const collectionRef = collection(db, 'home');
        const snapShot = await getDocs(query(collectionRef, orderBy('timestamp', 'desc')));

        const data = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setElements(data);

        dispatch(setStatus('succeeded'));

        console.log('Перезагрузилась страница HOME');
      } catch (error) {
        dispatch(setStatus('failed'));

        console.error('Ошибка получения документа: ', error);
      }
    };

    fetchNotes();
  }, [dispatch]);

  return (
    <div className="main page-home">
      <CreateNote />
      <MasonryGrid notes={{ elements }} />
    </div>
  );
};

export default Home;
