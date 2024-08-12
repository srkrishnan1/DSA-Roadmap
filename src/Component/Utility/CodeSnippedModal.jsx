import Modal from "./Modal";
import codeSnippets from "../../codeFile/codeData";
import { useSelector, useDispatch } from "react-redux";
import { IsModalIsOpen, setModal } from "../../features/Data/IsModalOpenSlice";
import { useState } from "react";
const CodeSnipped = () => {
  const codeId = useSelector(IsModalIsOpen).codeId;
  const [selectedLanguage, setSelectedLanguage] = useState("java");

  const snippets = codeSnippets.find((item) => item.problemId == codeId);

  const ModalStatus = useSelector(IsModalIsOpen).problemModal;
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(setModal("problemModal", false));
  };
  const handleChange = (e) => {
    setSelectedLanguage(e.target.value);
  };
  console.log(snippets["code"]["python"], "selected");
  console.log(selectedLanguage, "selected langualge");

  const title = (
    <div className="codeHeader">
      <select id="code" onChange={handleChange} className="languageOptions">
        <option value="java" className="options">Java</option>
        <option value="c++" className="options">C++</option>
        <option value="c" className="options">C</option>
        <option value="python" className="options">Python</option>
        <option value="javascript" className="options">JavaScript</option>
      </select>
    </div>
  );
  const children = (
    <div className="code">
      <prev>
        <code>
          {snippets["code"] ? snippets["code"][selectedLanguage] : ""}
        </code>
      </prev>
    </div>
  );
  const footer = (
    <button className="modalCancelBtn" onClick={onClose}>
      close
    </button>
  );
  return (
    <Modal
      show={ModalStatus}
      onClose={onClose}
      title={title}
      children={children}
      footer={footer}
    ></Modal>
  );
};

export default CodeSnipped;
