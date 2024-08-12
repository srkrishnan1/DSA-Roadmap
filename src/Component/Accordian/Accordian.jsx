import ProgressBar from "../Utility/ProgressBar";
import { FaChevronDown } from "react-icons/fa6";
import { TbCircleCheckFilled } from "react-icons/tb";

//Redux import
import { useSelector, useDispatch } from "react-redux";

import {
  changeStatus,
  resetAll,
  selectAllProblemsData,
} from "../../features/Data/ProblemsDataSlice";

import { useRef, useState, useEffect } from "react";
import AccordianContent from "./AccordianContent";
import NavBar from "../Utility/NavBar";
const ICON_SIZE = 18;
const Accordian = () => {
  const [expanded, setExpanded] = useState([]);
  const [searchWord, setSearchWord] = useState("");

  const listRef = useRef(null);
  const data = useSelector(selectAllProblemsData);
  const [searchResult, setSearchResult] = useState(data);
  const dispatch = useDispatch();
  const handleChange = (id, name) => {
    dispatch(changeStatus(id, name));
  };
  const [view, setView] = useState(false);
  useEffect(() => {
    const term = searchWord.toLowerCase();
    const newFilteredData = data
      .map((item) => {
        const topicMatches = item.topic.toLowerCase().includes(term);
        const problemMatches = topicMatches
          ? item.problems
          : item.problems.filter((problem) =>
              problem.problemName.toLowerCase().includes(term)
            );

        return {
          topic: item.topic,
          problems: problemMatches,
          showTopic: topicMatches || problemMatches.length > 0,
        };
      })
      .filter((item) => item.showTopic);

    setSearchResult(newFilteredData);
  }, [data, searchWord]);

  const calculateProgress = (totalProblems) => {
    const completedProblems = totalProblems.filter((item) => item.checked);
    let percentage =
      completedProblems.length == 0
        ? 0
        : (completedProblems.length / totalProblems.length) * 100;
    const total = totalProblems.length;
    const completed = completedProblems.length;
    return { completed, total, percentage };
  };
 

  const toggleAccordian = (index) => {
    setExpanded((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const toggleView = () => {
    setView((prev) => (prev = !prev));
  };

  return (
    <div className="problemsList">
      <NavBar
        toggleView={toggleView}
        
        view={view}
        setView={setView}
        searchWord={searchWord}
        setSearchWord={setSearchWord}
      />
      <div className="accordian">
        {searchResult.map((item, index) => (
          <div key={item.topic} className="accordianModal">
            {!view && (
              <div
                className={
                  calculateProgress(item.problems).percentage == 100
                    ? "finishedTopic topicHeader"
                    : "topicHeader"
                }
              >
                <div className="leftContent">
                  <div className="nameAndTick">
                    <p>{item.topic}</p>
                    {calculateProgress(item.problems).percentage == 100 && (
                      <TbCircleCheckFilled
                        color={"#10b981"}
                        className="checkMark"
                        size={ICON_SIZE}
                      />
                    )}
                  </div>
                  <ProgressBar progress={calculateProgress(item.problems)} />
                </div>
                <button
                  onClick={() => toggleAccordian(index)}
                  className={`transition-transform duration-300 ease-in-out transform ${
                    expanded.includes(index) ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <FaChevronDown
                    color={"white"}
                    className="transition-transform duration-300"
                  />
                </button>
              </div>
            )}
            {view && (
              <div className="groupedHead">
                <p className="groupedHeadTitle">{item.topic}</p>
              </div>
            )}

            <AccordianContent
              isActive={expanded.includes(index)}
              groupView={view}
              data={item.problems}
              changeStatus={handleChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accordian;
