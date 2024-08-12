import Accordian from "../Component/Accordian/Accordian";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { selectAllProblemsData } from "../features/Data/ProblemsDataSlice";
import SideBar from "../Component/SideBar/SideBar";

const Practise = () => {
  const data = useSelector(selectAllProblemsData);
  let total = 0,
    finished = 0;
  data.map((item) => {
    item.problems.map((problem) => {
      if (problem.checked) {
        finished++;
      }
      total++;
    });
  });
  const percentage = finished == 0 ? 0 : (finished / total) * 100;
  const progressStatus = (
    <div className="progressData">
      <p>
        {finished}/{total}
      </p>
      <div className="outerProgressBar">
        <div className="progressBar" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="practisePage">
      <SideBar />
      <div className="practisePageInner">
        <div className="topContent">
          <div className="introContent">
            <p className="title">Striver A-Z DSA Roadmap</p>
            This course is made for people who want to learn DSA from A to Z for
            free in a well-organized and structured manner. The lecture quality
            is better than what you get in paid courses, the only thing we don’t
            provide is doubt support, but trust me our YouTube video comments
            resolve that as well, we have a wonderful community of 250K+ people
            who engage in all of the videos.
          </div>
          {progressStatus}
        </div>
        <Accordian />
      </div>
      <div className="right-container"></div>
    </div>
  );
};

export default Practise;
