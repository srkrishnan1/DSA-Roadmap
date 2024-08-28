const ProgressBar = ({ progress }) => {

  const { completed, total, percentage } = progress;
  return (
    <div className="accordianProgress progress statsprogress">
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
