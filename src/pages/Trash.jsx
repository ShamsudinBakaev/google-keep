import { useSelector } from 'react-redux';
import MasonryGrid from '../components/MasonryGrid';

const Trash = () => {
  const elements = useSelector((state) => state.trash);

  return (
    <div className="main page-trash">
      <MasonryGrid notes={{ elements }} />
    </div>
  );
};

export default Trash;
