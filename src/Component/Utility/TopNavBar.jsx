import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/FirebaseConfiguration/config";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { IsModalIsOpen, setModal } from "../../features/Data/IsModalOpenSlice";
const TopNavBar = () => {
  const [user] = useAuthState(auth);
  const location = useLocation();

  const dispatch = useDispatch();

  return (
    <div className="TopNavbar">
      <div className="LeftNavBtns">
        <button
          className={
            location.pathname == "/" ? "navBtns activeNavBtns" : "navBtns"
          }
        >
          <Link to="/">Practise</Link>
        </button>
        <button
          className={
            location.pathname == "/roadmap"
              ? "navBtns activeNavBtns"
              : "navBtns"
          }
        >
          <Link to="/roadmap">RoadMap</Link>
        </button>
      </div>
      <div>
        {!user && (
          <button onClick={() => dispatch(setModal("signInModal", true))}>
            Sign In
          </button>
        )}

        {user && (
          <button onClick={() => dispatch(setModal("signOutModal", true))}>
            <img src={user.photoURL || ""} className="profileAvatar" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopNavBar;
