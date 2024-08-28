import { useEffect, useState } from "react";
import StatsDashBoard from "./Stats/StatsDashBoard";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
const SideBar = ({ heading, children, giveWidth, classname }) => {


  const [isSideBarActive, setSideBarActive] = useState(true);
  const [maxWidth, setMaxWidth] = useState(giveWidth);

  const toggleSideBar = () => {
    if (isSideBarActive) {
      setMaxWidth("60px");
      setSideBarActive(false);
    } else {
      setMaxWidth(giveWidth);
      setSideBarActive(true);
    }
  };
  return (
    <div className={`sideBar ${classname}`} style={{ minWidth: maxWidth }}>
      <div className="sideBar-content-wrapper">
        <div className="sideBarHeader">
          {isSideBarActive && <div className="menu-space"></div>}
          {isSideBarActive && <>{heading}</>}
          <button
            className={
              isSideBarActive ? "sideBarHeaderBtn" : "sideBarHeaderBtn active"
            }
            onClick={toggleSideBar}
          >
            {isSideBarActive ? <FaArrowLeft /> : <FaArrowRight />}
          </button>
        </div>
        {isSideBarActive && <div className="sideBarContent">{children}</div>}
      </div>
    </div>
  );
};

export default SideBar;
