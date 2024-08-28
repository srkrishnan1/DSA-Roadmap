import PlaylistDiv from "./PlaylistDiv";


const PlaylistContainer = ({ heading, description, children }) => {

  return (
    <div className="playlistContainer">
      <div className="playlistDetails">
        <h2>{heading}</h2>
        <p>{description}</p>
      </div>
      <div className="playlistDivGroup">
        {children?.map((item) => (
          <PlaylistDiv
            img={item.ImageUrl}
            title={item.CourseTitle}
            description={item.Description}
            time={item.Time}
            difficulty={item.Difficulty}
            key={item.CourseId}
            Id={item.CourseId}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaylistContainer;
