import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [opening, setOpening] = React.useState(false);
  const handleSidebarInteraction = (isMouseEnter) => {
    setOpening(isMouseEnter);
  };

  return (
    <div
      className={`sidebar ${opening ? 'open' : ''}`}
      onMouseEnter={() => handleSidebarInteraction(true)}
      onMouseLeave={() => handleSidebarInteraction(false)}>
      <div className="section-elements">
        <NavLink
          className="element"
          to="/"
          style={({ isActive }) => {
            return isActive ? { backgroundColor: '#feefc3' } : {};
          }}>
          <img src="../../public/sidebar/notes.svg" alt="" />
          <p className="page-link" to="/home">
            Notes
          </p>
        </NavLink>
        <NavLink
          className="element"
          to="/archive"
          style={({ isActive }) => {
            return isActive ? { backgroundColor: '#feefc3' } : {};
          }}>
          <img src="../../public/sidebar/archive.svg" alt="" />
          <p className="page-link" to="/archive">
            Archive
          </p>
        </NavLink>
        <NavLink
          className="element"
          to="/trash"
          style={({ isActive }) => {
            return isActive ? { backgroundColor: '#feefc3' } : {};
          }}>
          <img src="../../public/sidebar/trash.svg" alt="" />
          <p className="page-link" to="/trash">
            Trash
          </p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
