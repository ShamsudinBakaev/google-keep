import { useSelector } from 'react-redux';
import MasonryGrid from '../components/MasonryGrid';

const Archive = () => {
  const elements = useSelector((state) => state.archive);

  return (
    <div className="main page-archive">
      <MasonryGrid notes={{ elements }} />
    </div>
  );
};

export default Archive;
