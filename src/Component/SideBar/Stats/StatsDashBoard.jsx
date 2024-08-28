import { useSelector, useDispatch } from "react-redux";
import { selectAllProblemsData } from "../../../features/Data/ProblemsDataSlice";
import StatsProgressBar from "./StatsProgressBar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../app/FirebaseConfiguration/config";
import { useState, useEffect } from "react";

const StatsDashBoard = () => {
  const data = useSelector(selectAllProblemsData);
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();

  var problemsStatusArray = [
    { Difficulty: "Easy", total: 0, completed: 0 },
    { Difficulty: "Medium", total: 0, completed: 0 },
    { Difficulty: "Hard", total: 0, completed: 0 },
  ];
 
  data?.forEach((element) => {
    element.Problems.forEach((problem) => {
      if (problem.Difficulty == "Easy") {
        problemsStatusArray[0].total++;
        problem.Checked
          ? problemsStatusArray[0].completed++
          : problemsStatusArray[0].completed;
      } else if (problem.Difficulty == "Medium") {
        problemsStatusArray[1].total++;
        problem.Checked
          ? problemsStatusArray[1].completed++
          : problemsStatusArray[1].completed;
      } else if (problem.Difficulty == "Hard") {
        problemsStatusArray[2].total++;
        problem.Checked
          ? problemsStatusArray[2].completed++
          : problemsStatusArray[2].completed;
      }
    });
  });

  return (
    <div className="statsDashboard">
      <p className="statsTtile">Stats</p>
      <div className="combinedStatsProgressBars">
        {problemsStatusArray?.map((item, index) => (
          <StatsProgressBar props={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default StatsDashBoard;
