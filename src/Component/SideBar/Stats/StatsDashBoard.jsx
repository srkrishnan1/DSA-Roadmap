import { useSelector } from "react-redux";
import { selectAllProblemsData } from "../../../features/Data/ProblemsDataSlice";
import StatsProgressBar from "./StatsProgressBar";

const StatsDashBoard = () => {
  const data = useSelector(selectAllProblemsData);
  var problemsStatusArray = [
    { difficulty: "Easy", total: 0, completed: 0 },
    { difficulty: "Medium", total: 0, completed: 0 },
    { difficulty: "Hard", total: 0, completed: 0 },
  ];
  data.forEach((element) => {
    element.problems.forEach((problem) => {
      if (problem.difficulty == "Easy") {
        problemsStatusArray[0].total++;
        problem.checked
          ? problemsStatusArray[0].completed++
          : problemsStatusArray[0].completed;
      } else if (problem.difficulty == "Medium") {
        problemsStatusArray[1].total++;
        problem.checked
          ? problemsStatusArray[1].completed++
          : problemsStatusArray[1].completed;
      } else if (problem.difficulty == "Hard") {
        problemsStatusArray[2].total++;
        problem.checked
          ? problemsStatusArray[2].completed++
          : problemsStatusArray[2].completed;
      }
    });
  });
  console.log(problemsStatusArray);
  return (
    <div className="statsDashboard">
    <p className="statsTtile">Stats</p>
    <div className="combinedStatsProgressBars">
      {problemsStatusArray.map((item) => (
        <StatsProgressBar props={item} />
      ))}
      </div>
    </div>
  );
};

export default StatsDashBoard;
