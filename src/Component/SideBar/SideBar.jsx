import { useState } from "react";
import StatsDashBoard from "./Stats/StatsDashBoard";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
const SideBar = () => {
  const [isSideBarActive, setSideBarActive] = useState(true);
  const [maxWidth, setMaxWidth] = useState("250px");

  const toggleSideBar = () => {
    if (isSideBarActive) {
      setMaxWidth("60px");
      setSideBarActive(false);
    } else {
      setMaxWidth("250px");
      setSideBarActive(true);
    }
  };
  return (
    <div className="sideBar" style={{ minWidth: maxWidth }}>
      <div className="sideBarHeader">
        {isSideBarActive && <div className="menu-space"></div>}
        {isSideBarActive && <p className="title">Menu</p>}
        <button
          className={
            isSideBarActive ? "sideBarHeaderBtn" : "sideBarHeaderBtn active"
          }
          onClick={toggleSideBar}
        >
          {isSideBarActive ? <FaArrowLeft /> : <FaArrowRight />}
        </button>
      </div>
      {isSideBarActive && (
        <div className="sideBarContent">
          <StatsDashBoard />
        </div>
      )}
    </div>
  );
};

export default SideBar;
