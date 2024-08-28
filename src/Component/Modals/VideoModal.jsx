import { useDispatch, useSelector } from "react-redux";
import { selectVideoURL } from "../../features/VideoIframeUrlSlice";
import { IsModalIsOpen, setModal } from "../../features/Data/IsModalOpenSlice";
import Modal from "../Modals/Modal";

const VideoModal = () => {
  const url = useSelector(selectVideoURL);
  const ModalStatus = useSelector(IsModalIsOpen).videoModal;
  const dispatch = useDispatch();

  const getVideoId = (url) => {
    const regex = /youtube\.com\/embed\/([\w-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);
  const onClose = () => {
    dispatch(setModal("videoModal", false));
  };
  const title = (
    <div className="videoModalHeader">
      <p>Video Solution</p>

      <button>
        <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank">
          View on youtube
        </a>
      </button>
    </div>
  );
  const children = (
    <div className="videoModalBody">
      <div className="videoContent ">
        {ModalStatus && (
          <iframe
            width="100%"
            height="100%"
            src={url}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            className="Iframe"
            allowfullscreen
          ></iframe>
        )}
      </div>
    </div>
  );
  const footer = (
    <>
      <button className="modalCancelBtn" onClick={onClose}>
        Close
      </button>
    </>
  );
  return (
    <Modal
      show={ModalStatus}
      title={title}
      onClose={onClose}
      children={children}
      footer={footer}
    ></Modal>
    //   <
  );
};

export default VideoModal;
