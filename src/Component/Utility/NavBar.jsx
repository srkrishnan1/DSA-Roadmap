import { useState } from "react";
import { FaLayerGroup } from "react-icons/fa";
import { RxReset } from "react-icons/rx";

import { FaListAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { IsModalIsOpen, setModal } from "../../features/Data/IsModalOpenSlice";

const NavBar = ({
  toggleView,
  delteProgress,
  view,
  setView,
  searchWord,
  setSearchWord,
}) => {
  const dispatch = useDispatch();
  const data = useSelector(IsModalIsOpen);

  // const onClose = () => {
  //   dispatch(setModal("deleteModal", false));
  // };
  // const openModal = () => {
  //   dispatch(setModal("deleteModal", true));
  // };
  return (
    <div className="navBar">
      <form className="searchFrom" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search" className="searchLabel">
          Search
        </label>
        <input
          id="search"
          type="text"
          role="searchbox"
          placeholder="Search"
          className="inputSearch"
          value={searchWord}
          onChange={(e) => {
            setView(true);
            setSearchWord(e.target.value);
          }}
        ></input>
      </form>
      <div className="rightContent">
        <button
          className="navBtn groupBtn"
          title={view ? "Show Group View" : "Show List view"}
          onClick={toggleView}
        >
          {view && <FaListAlt color={"white"} />}
          {!view && <FaLayerGroup color={"white"} />}
        </button>
        <button
          className="navBtn resetBtn"
          title="Reset All Progress"
          onClick={() => dispatch(setModal("deleteModal", true))}
        >
          <RxReset color={"white"} />
        </button>
      </div>
    </div>
  );
};

export default NavBar;
