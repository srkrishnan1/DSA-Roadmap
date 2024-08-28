const StatsProgressBar = ({ props }) => {
  const { Difficulty, total, completed } = props;
  const percentage = completed == 0 ? 0 : (completed / total) * 100;

  return (
    <div className="combinedStatsProgress">
      <div className="statsProgress">
        <p>{Difficulty}</p>
        <p>
          {completed}/{total}
        </p>
      </div>
      <div className="outerProgressBar">
        <div
          className={`${Difficulty}ProgressBar statsprogress`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatsProgressBar;
