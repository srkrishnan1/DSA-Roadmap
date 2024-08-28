import ProgressBar from "../Utility/ProgressBar";
import { FaChevronDown } from "react-icons/fa6";
import { TbCircleCheckFilled } from "react-icons/tb";

//Redux import
import { useSelector, useDispatch } from "react-redux";

import {
  changethunk,
  selectAllProblemsData,
  toggleData,
} from "../../features/Data/ProblemsDataSlice";

import { useRef, useState, useEffect } from "react";
import AccordianContent from "./AccordianContent";
import NavBar from "../Utility/NavBar";
import { useChangeStauts } from "../../features/Courses/GetUserDetails";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../app/FirebaseConfiguration/config";
const ICON_SIZE = 18;
const Accordian = () => {

  const [expanded, setExpanded] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const data = useSelector(selectAllProblemsData);
  const [searchResult, setSearchResult] = useState(data);

  const [user] = useAuthState(auth);
  const dispatch = useDispatch();

  const handleChange = (id, name) => {
    dispatch(toggleData(name, id));
    dispatch(changethunk({ user, id, name }));
  };
  const [view, setView] = useState(false);



  useEffect(() => {
    const term = searchWord.toLowerCase();
    const newFilteredData = data
      ?.map((item) => {
        const topicMatches = item.Name.toLowerCase().includes(term);
       
        const problemMatches = topicMatches
          ? item.Problems
          : item.Problems.filter((problem) =>
              problem.ProblemName.toLowerCase().includes(term)
            );

     
        return {
          ...item,
          Problems: problemMatches,
          showTopic: topicMatches || problemMatches.length > 0,
        };
      })
      .filter((item) => item.showTopic);

    setSearchResult(newFilteredData);
   
  }, [data, searchWord]);

  const calculateProgress = (totalProblems) => {
    const completedProblems = totalProblems.filter((item) => item.Checked);
    let percentage =
      completedProblems.length == 0
        ? 0
        : (completedProblems.length / totalProblems.length) * 100;
    const total = totalProblems.length;
    const completed = completedProblems.length;
    return { completed, total, percentage };
  };

  const toggleAccordian = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
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
        {searchResult?.map((item) => (
          <div key={item.ID} className="accordianModal">
            {!view && (
              <div
                className={
                  calculateProgress(item.Problems).percentage == 100
                    ? "finishedTopic topicHeader"
                    : "topicHeader"
                }
              >
                <div className="leftContent">
                  <div className="nameAndTick">
                    <p>{item.Name}</p>
                    {calculateProgress(item.Problems).percentage == 100 && (
                      <TbCircleCheckFilled
                        color={"#10b981"}
                        className="checkMark"
                        size={ICON_SIZE}
                      />
                    )}
                  </div>
                  <ProgressBar progress={calculateProgress(item.Problems)} />
                </div>
                <button
                  onClick={() => toggleAccordian(item.ID)}
                  className={`transition-transform duration-300 ease-in-out transform ${
                    expanded.includes(item.ID) ? "rotate-180" : "rotate-0"
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
                <p className="groupedHeadTitle">{item.Name}</p>
              </div>
            )}

            <AccordianContent
              isActive={expanded.includes(item.ID)}
              groupView={view}
              data={item.Problems}
              changeStatus={handleChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accordian;
