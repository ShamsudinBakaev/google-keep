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
    <div className={`header ${!top ? 'with-shadow' : ''}`}>
      <div className="burger-logo">
        <div className="burger">
          <img src="/hamburger-menu.svg" alt="" />
        </div>

        <div className="logo">
          <img src="/keep.png" alt="" />
          <p>Keep</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
