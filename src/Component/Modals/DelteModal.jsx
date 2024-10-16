import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { IsModalIsOpen, setModal } from "../../features/Data/IsModalOpenSlice";
import { useDeleteAllProgress } from "../../features/Courses/GetUserDetails";
import { deleteData, deleteThunk } from "../../features/Data/ProblemsDataSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/FirebaseConfiguration/config";

const DeleteModal = () => {
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const deleteprogress = () => {
    dispatch(deleteThunk({ user }));
    dispatch(deleteData());
    onClose();
  };
  const ModalStatus = useSelector(IsModalIsOpen).deleteModal;

  const onClose = () => {
    dispatch(setModal("deleteModal", false));
  };
  const children = (
    <>
      <p>Are you sure want to delete all progress ?</p>
      <p>You will loose all your stored progress.</p>
    </>
  );
  const footer = (
    <>
      <button className="modalCancelBtn" onClick={deleteprogress}>
        Yes Delete it
      </button>
      <button className="modalCloseBtn" onClick={onClose}>
        No
      </button>
    </>
  );

  return (
    <Modal
      show={ModalStatus}
      onClose={onClose}
      title={<p>Delete Progress</p>}
      children={children}
      footer={footer}
    ></Modal>
  );
};

export default DeleteModal;
