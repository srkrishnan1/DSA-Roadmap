import { HiOutlineLink } from "react-icons/hi";
import { HiVideoCamera } from "react-icons/hi";
import { FiExternalLink } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { setURL, selectVideoURL } from "../../features/VideoIframeUrlSlice";
import { IsModalIsOpen, setModal } from "../../features/Data/IsModalOpenSlice";

import { useSelector, useDispatch } from "react-redux";

const ICON_SIZE = 18;
const btnDisabledColor = "#94a3b8";
const START_COLOR = "#eab308";

const List = ({ data, changeStatus }) => {
  const dispatch = useDispatch();
  const ModalStatus = useSelector(IsModalIsOpen);

  return (
    <div className="">
      <table className="problemTable">
        <thead className="tableHead">
          <tr className="tableHeadRow">
            <td className="section1 sectionOneHeader sectionHeaders">Status</td>
            <td className="section2 sectionTwoHeader sectionHeaders">Star</td>
            <td className="section3 sectionThreeHeader sectionHeaders">
              Problem
            </td>
            <td className="section4 sectionFourHeader sectionHeaders">
              Difficulty
            </td>
            <td className="section5 sectionFiveHeader sectionHeaders">Video</td>
            <td className="section6 sectionSixHeader sectionHeaders">
              Article
            </td>
          </tr>
        </thead>
        <tbody className="tableBody">
          {data.map((item) => (
            <tr
              className={item.Checked ? "listRow rowFinished" : "listRow"}
              key={item.id}
            >
              <td className="section1 sectionBody">
                <div>
                  <button
                    onClick={() => {
                      changeStatus(item.id, "Checked");
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.Checked}
                      className="checkbox"
                    ></input>
                  </button>
                </div>
              </td>
              <td className="section2 sectionBody">
                <div>
                  <button
                    onClick={() => changeStatus(item.id, "Stared")}
                  >
                    {!item.Stared ? (
                      <FaRegStar color={START_COLOR} size={ICON_SIZE} />
                    ) : (
                      <FaStar color={START_COLOR} size={ICON_SIZE} />
                    )}
                  </button>
                </div>
              </td>
              <td className="section3 sectionBody">
                <div className="problemNameAndLink">
                  <p>{item.ProblemName} </p>
                  <button>
                    <a href={item.ProblemExternalLink} target="_blank">
                      <FiExternalLink size={ICON_SIZE} />
                    </a>
                  </button>
                </div>
              </td>
              <td className="section4 sectionBody">
                <div>
                  <p className={item.Difficulty}>{item.Difficulty}</p>
                </div>
              </td>
              <td className="section5 sectionBody">
                <div>
                  <button
                    disabled={!item.Video}
                    onClick={() => {
                      dispatch(setURL(item.Video));
                      dispatch(setModal("videoModal", true));
                    }}
                  >
                    <HiVideoCamera
                      size={ICON_SIZE}
                      color={!item.Video && btnDisabledColor}
                    />
                  </button>
                </div>
              </td>
              <td className="section6 sectionBody">
                <div>
                  <button
                    disabled={!item.Article}
                    onClick={() => {
                      dispatch(setModal("problemModal", true));
                      dispatch(setModal("codeId", item.ProblemId));
                    }}
                  >
                    <HiOutlineLink
                      size={ICON_SIZE}
                      color={!item.Article && btnDisabledColor}
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
