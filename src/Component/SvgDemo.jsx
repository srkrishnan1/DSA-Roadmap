import { useEffect, useState } from "react";
import { selectAllProblemsData } from "../features/Data/ProblemsDataSlice";
import { useSelector } from "react-redux";

const SvgDemo = () => {
  const [dimension, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      document.addEventListener("resize", handleResize);
      return () => document.removeEventListener("resize", handleResize);
    };
  }, []);

  const data = useSelector(selectAllProblemsData);
  let finished = 0;

  let total = 0;
  const percentage = (finished / total) * 100;
  const progressStatus = (problems) => {
    total = 0;
    finished = 0;
    problems.map((item) => {
      if (item.checked) finished++;
      total++;
    });
    const percentage = finished ? 0 : (finished / total) * 100;
    return (
      <div className="progressData">
        <div className="outerProgressBar">
          <div
            className="progressBar"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };
  let y = 0;
  let position = 100;
  let stackLength = 0;
  let previousGroup = 1;
  let lengthOfGroups = 0;
  let resultArray = [];
  const widthOfBox = 240;
  const heightOfBox = 80;
  const gap = 20;
  const stack = [];
  let startingHorizontal = 0;

  data.forEach((item) => {
    if (stack.length === 0 || stack[stack.length - 1].group === item.group)
      stack.push(item);
    else {
      console.log("Inside if statement");
      const totalWidth =
        dimension.width - stack.length * widthOfBox + (stack.length - 1) * gap;
      const StartingX = totalWidth / 2;
      startingHorizontal = StartingX;
      while (stack.length > 0) {
        const groups = stack.pop();
        console.log(stack, "inside while loop");

        resultArray.push(
          <g
            className="svgContainer"
            transform={`translate(${startingHorizontal} , ${y})`}
            id={groups.id}
          >
            <foreignObject className="foreignObjectContainer">
              <div className="htmlContainer">
                <p className="title">{groups.topic}</p>
                {progressStatus(groups.problems)}
              </div>
            </foreignObject>
          </g>
        );
        startingHorizontal + gap;
      }
    }
    y += heightOfBox + gap;
  });
  console.log(resultArray, "Result array");

  //   if (groupId == previousGroup) {
  //     return `translate(50%,${(y += 0)})`;
  //   } else {
  //     position = 0;
  //     previousGroup = groupId;
  //     return `translate(50%,${(y += 250)})`;
  //   }

  return (
    <svg className="svgCanvas" xmlns="http://www.w3.org/2000/svg">
      {resultArray}
    </svg>
  );
};

export default SvgDemo;
