import React from 'react';

const Header = () => {
  const [top, setTop] = React.useState(true);

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
        <img className="icon search-svg" src="/header/search.svg" alt="" />
        <input type="text" id="search" placeholder="Search" />
        <img className="icon x-svg" src="/header/x.svg" alt="" />
      </div>
    </div>
  );
};

export default Header;
