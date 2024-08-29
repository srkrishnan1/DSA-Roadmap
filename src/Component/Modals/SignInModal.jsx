import {
  auth,
  GoogleProvider,
  GitHubProvider,
} from "../../app/FirebaseConfiguration/config";
import { signInWithPopup } from "firebase/auth";
import Modal from "../Modals/Modal";
import { useSelector, useDispatch } from "react-redux";
import { IsModalIsOpen, setModal } from "../../features/Data/IsModalOpenSlice";
const SignInModal = () => {
  const dispatch = useDispatch();
  const ModalStatus = useSelector(IsModalIsOpen).signInModal;
  const signInWithGoogle = async () => {
    const response = await signInWithPopup(auth, GoogleProvider);

    dispatch(setModal("signInModal", false));
  };
  const signInWithGitHub = async () => {
    const response = await signInWithPopup(auth, GitHubProvider);
    dispatch(setModal("signInModal", false));
  };
  const onClose = () => {
    dispatch(setModal("signInModal", false));
  };
  const children = (
    <div className="modalSinginBtns">
      <button className="googleSingin signBtns" onClick={signInWithGoogle}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/dsaroadmap-30dd3.appspot.com/o/CoverImage%2Fgoogle.png?alt=media&token=5f50e6b2-d2f4-4e04-97f5-b0dfdec34054"
          alt="Sign with google"
          className="signImages"
        />
        Sign in with google
      </button>
      <button className="githubSingin signBtns" onClick={signInWithGitHub}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/dsaroadmap-30dd3.appspot.com/o/CoverImage%2Fgithub.png?alt=media&token=ae5b7a08-1045-45ed-9591-991bdce97cfd"
          alt="Sign with google"
          className="signImages"
        />
        Sigin in with Github
      </button>
      <p className="mischallneous">
        By Sigin in you are agreeing the terms and conditions.
      </p>
    </div>
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
      title={<p>Sign In</p>}
      children={children}
      footer={footer}
    ></Modal>
  );
};

export default SignInModal;
