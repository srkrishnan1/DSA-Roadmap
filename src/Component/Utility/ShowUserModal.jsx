import Modal from "./Modal";
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
  console.log(ModalStatus, "Stauts..");

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
              ? "../../../public/google.png"
              : "../../../public/github.png"
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
