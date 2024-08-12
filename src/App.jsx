import { useState } from "react";

import "./App.css";

import { store } from "./app/store";
import { Provider } from "react-redux";
import VideoModal from "./Component/Utility/VideoModal";
import TopNavBar from "./Component/Utility/TopNavBar";
import SignInModal from "./Component/Utility/SignInModal";
import ShowUserProfile from "./Component/Utility/ShowUserModal";
import DeleteModal from "./Component/Utility/DelteModal";
import CodeSnipped from "./Component/Utility/CodeSnippedModal";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Practise from "./Pages/Practise";
import SideBar from "./Component/SideBar/SideBar";
import SvgDemo from "./Component/SvgDemo";
import RaodMap from "./Pages/RaodMap";

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <TopNavBar />
          <div className="main">
            <Routes>
              <Route path="/" element={<Practise />} />
              {/* <Route path="/roadmap" element={<RaodMap />} /> */}
            </Routes>

            <SignInModal />
            <ShowUserProfile />
            <VideoModal />
            <DeleteModal />
            <CodeSnipped />
          </div>
        </Router>
      </Provider>
    </>
  );
}

export default App;
