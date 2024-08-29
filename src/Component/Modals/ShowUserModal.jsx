import Modal from "../Modals/Modal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/FirebaseConfiguration/config";
import { signOut } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { IsModalIsOpen, setModal } from "../../features/Data/IsModalOpenSlice";

const ShowUserProfile = () => {
  const [user] = useAuthState(auth);
  const ModalStatus = useSelector(IsModalIsOpen).signOutModal;
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(setModal("signOutModal", false));
  };


  const signOutUser = async () => {
    signOut(auth);

    onClose();
  };
  const children = (
    <>
      <button className="googleSingin signBtns" onClick={signOutUser}>
        <img
          src={
            user?.providerData[0].providerId == "google.com"
              ? "https://firebasestorage.googleapis.com/v0/b/dsaroadmap-30dd3.appspot.com/o/CoverImage%2Fgoogle.png?alt=media&token=5f50e6b2-d2f4-4e04-97f5-b0dfdec34054"
              : "https://firebasestorage.googleapis.com/v0/b/dsaroadmap-30dd3.appspot.com/o/CoverImage%2Fgithub.png?alt=media&token=ae5b7a08-1045-45ed-9591-991bdce97cfd"
          }
          alt="Sign with google"
          className="signImages"
        />
        {user?.providerData[0].providerId == "google.com"
          ? "Sign Out from Google"
          : "Sign Out from Github"}
      </button>
    </>
  );
  const footer = (
    <button className="modalCancelBtn" onClick={onClose}>
      No
    </button>
  );
  return (
    <Modal
      show={ModalStatus}
      onClose={onClose}
      title={<p>&#128075; {user?.displayName}</p>}
      children={children}
      footer={footer}
    ></Modal>
  );
};

export default ShowUserProfile;
