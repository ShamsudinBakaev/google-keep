import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContextProvider';

const Header = () => {
  const [top, setTop] = React.useState(true);

  const { inputValue, handleSearch } = useSearch();

  React.useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 1 ? setTop(false) : setTop(true);
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);

  return (
    <div className={`header ${!top ? 'header-with-shadow' : ''}`}>
      <div className="burger-logo">
        <div className="burger">
          <img src="/header/hamburger-menu.svg" alt="" />
        </div>

        <div className="logo">
          <img src="/header/keep.png" alt="" />
          <p>Keep</p>
        </div>
      </div>

      <div className="search-form">
        <NavLink to="/search" className="icon search-svg" title="Search">
          <img src="/header/search.svg" alt="" />
        </NavLink>
        <NavLink to="/search" className="search">
          <input type="text" placeholder="Search" value={inputValue} onChange={handleSearch} />
        </NavLink>
        <NavLink to="/" className="icon x-svg" title="Delete search query">
          <img src="/header/x.svg" alt="" />
        </NavLink>
      </div>
    </div>
  );
};

export default Header;
