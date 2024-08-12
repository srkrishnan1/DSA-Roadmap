const StatsProgressBar = ({ props }) => {
  const { difficulty, total, completed } = props;
  const percentage = completed == 0 ? 0 : (completed / total) * 100;

  return (
    <div className="combinedStatsProgress">
      <div className="statsProgress">
        <p>{difficulty}</p>
        <p>
          {completed}/{total}
        </p>
      </div>
      <div className="outerProgressBar">
        <div
          className={`${difficulty}ProgressBar statsprogress`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatsProgressBar;
