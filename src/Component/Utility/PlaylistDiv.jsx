import { Link, Outlet } from "react-router-dom";

const PlaylistDiv = ({ img, title, description, time, difficulty, Id }) => {
  const pathId = Id;

  return (
    <>
      <Link to={`${pathId}`}>
        <div className="playlistDiv">
          <div className="imgContainer">
            <img src={img} alt="" />
          </div>
          <div className="playlistDivDetails">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <div className="playlistFooter">
            <div className={`badge ${difficulty}`}>{difficulty}</div>
            <div className="badge timeBadge">{time}</div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default PlaylistDiv;
