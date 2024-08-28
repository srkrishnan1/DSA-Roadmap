import codeSnippets from "../../codeFile/codeData";
import { useSelector, useDispatch } from "react-redux";
import { IsModalIsOpen, setModal } from "../../features/Data/IsModalOpenSlice";
import { useEffect, useState } from "react";
import { FaRegClipboard } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";

import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Modal from "./Modal";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../app/FirebaseConfiguration/config";

const CodeSnipped = () => {
  const codeId = useSelector(IsModalIsOpen).codeId;
  const [selectedLanguage, setSelectedLanguage] = useState("C");
  const [copy, setCopy] = useState(false);
  let sortedKeys = [];

  const [snippets, setSnippets] = useState({});
  const ModalStatus = useSelector(IsModalIsOpen).problemModal;
  const dispatch = useDispatch();
  const onClose = () => {
    dispatch(setModal("problemModal", false));
  };
  const handleChange = (e) => {
    setSelectedLanguage(e.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(db, "IndividualProblems", codeId);
        const data = await getDoc(ref);
        setSnippets(data.data());
      } catch (er) {
        console.log(er);
      }
    };
    if (codeId) fetchData();
  }, [codeId]);
  sortedKeys = Object.keys(snippets).sort();
  const title = (
    <div className="codeHeader">
      <select id="code" onChange={handleChange} className="languageOptions">
        {sortedKeys.map((key, index) => (
          <>
            <option value={key} className="options" key={index}>
              {key}
            </option>
          </>
        ))}
      </select>
    </div>
  );
  const children = snippets && (
    <div className="code">
      {!copy ? (
        <button
          className="copyBtn"
          onClick={() => {
            navigator.clipboard.writeText(
              snippets ? snippets[selectedLanguage] : ""
            );
            setCopy(true);
            setTimeout(() => setCopy(false), 2000);
          }}
        >
          <FaRegClipboard />
          <p>Copy</p>
        </button>
      ) : (
        <button className="copyBtn">
          <FaCheck />
          <p>Copied</p>
        </button>
      )}

      <SyntaxHighlighter
        language={selectedLanguage}
        style={atomOneDark}
        className="codeHighlighter"
        wrapLongLines={true}
      >
        {snippets ? snippets[selectedLanguage] : ""}
      </SyntaxHighlighter>
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
