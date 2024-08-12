import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { IsModalIsOpen, setModal } from "../../features/Data/IsModalOpenSlice";
import { resetAll } from "../../features/Data/ProblemsDataSlice";

const DeleteModal = () => {
  const dispatch = useDispatch();
  const delteProgress = () => {
    dispatch(resetAll());
    onClose();
  };
  const ModalStatus = useSelector(IsModalIsOpen).deleteModal;
  console.log(ModalStatus, "In the delete modal");
  const onClose = () => {
    dispatch(setModal("deleteModal", false));
  };
  const children = (
    <>
      <p>Are you sure want to delte all progress ?</p>
      <p>
        This will delte from the following list: Blind75 A-Z DSA Leetcode all
      </p>
    </>
  );
  const footer = (
    <>
      <button className="modalCancelBtn" onClick={delteProgress}>
        Yes Delte it
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
      title={<p>Delte Progress</p>}
      children={children}
      footer={footer}
    ></Modal>
  );
};

export default DeleteModal;
