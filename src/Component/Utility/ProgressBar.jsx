const ProgressBar = ({ progress }) => {
  const { completed, total, percentage } = progress;
  return (
    <div className="progress statsprogress accordianProgress">
      <p>
        {completed}/{total}
      </p>
      <div className="outerProgressBar">
        <div className="progressBar" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;
