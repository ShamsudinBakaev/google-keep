import React from 'react';
import CreateNote from '../components/CreateNote';
import MasonryGrid from '../components/MasonryGrid';
import { useSelector } from 'react-redux';

const Home = () => {
  const elements = useSelector((state) => state.home);

  React.useEffect(() => {
    console.log('Компонент перерисовался');
  }, []);

  return (
    <div className="main page-home">
      <CreateNote />
      <MasonryGrid notes={{ elements }} />
    </div>
  );
};

export default Home;
