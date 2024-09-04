import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
import Spinner from "react-bootstrap/Spinner";

import Accordian from "../Component/Accordian/Accordian";
import SideBar from "../Component/SideBar/SideBar";
import StatsDashBoard from "../Component/SideBar/Stats/StatsDashBoard";
import { auth } from "../app/FirebaseConfiguration/config";

import {
  getError,
  getStatus,
  selectAllProblemsData,
} from "../features/Data/ProblemsDataSlice";
import Loader from "../Component/Utility/Loader";


// Custom hook to calculate progress
const useProgress = (data) => {
  const [progress, setProgress] = useState({
    total: 0,
    finished: 0,
    percentage: 0,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      let totalProblems = 0;
      let finishedProblems = 0;

      data.forEach((item) =>
        item.Problems.forEach((item) => {
          if (item.Checked) finishedProblems++;
          totalProblems++;
        })
      );

      const percentage =
        finishedProblems === 0 ? 0 : (finishedProblems / totalProblems) * 100;

      setProgress({
        total: totalProblems,
        finished: finishedProblems,
        percentage,
      });
    }
  }, [data]);

  return progress;
};

const Practise = () => {
  const problemsData = useSelector(selectAllProblemsData);
  const status = useSelector(getStatus);
  const error = useSelector(getError);


  const progress = useProgress(problemsData);

  return (
    <>
      <div className="practisePage">
        {error && <p className="errorPara">Please Reload the Page</p>}
        <SideBar
          heading={<p>Menu</p>}
          children={<StatsDashBoard />}
          giveWidth={"220px"}
          classname={"practiseSidebar"}
        />
        {status == "Loading" ? (
          <Loader />
        ) : (
          !error && (
            <div className="practisePageInner">
              <div className="topContent">
                <div className="introContent">
                  <p className="title">Striver A-Z DSA Roadmap</p>
                  <p>
                    This course is made for people who want to learn DSA from A
                    to Z for free in a well-organized and structured manner. The
                    lecture quality is better than what you get in paid courses.
                    The only thing we don’t provide is doubt support, but trust
                    me, our YouTube video comments resolve that as well. We have
                    a wonderful community of 250K+ people who engage in all of
                    the videos.
                  </p>
                </div>
                <div className="progressData">
                  <p>
                    {progress.finished}/{progress.total}
                  </p>
                  <div className="outerProgressBar">
                    <div
                      className="progressBar"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <Accordian />
            </div>
          )
        )}

        <div className="right-container"></div>
      </div>
    </>
  );
};

export default Practise;
