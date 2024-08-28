import { Outlet } from "react-router";
import TopNavBar from "../Component/Utility/TopNavBar";
import SignInModal from "../Component/Modals/SignInModal";
import ShowUserProfile from "../Component/Modals/ShowUserModal";
import VideoModal from "../Component/Modals/VideoModal";
import DeleteModal from "../Component/Modals/DelteModal";
import CodeSnipped from "../Component/Modals/CodeSnippedModal";

const Layout = () => {
  return (
    <div>
      <TopNavBar />
      <div className="main">
        <Outlet />
      </div>
      <SignInModal />
      <ShowUserProfile />
      <VideoModal />
      <DeleteModal />
      <CodeSnipped />
    </div>
  );
};

export default Layout;
