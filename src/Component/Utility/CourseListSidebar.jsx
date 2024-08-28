const CourseListSidebar = ({ data, activeList, setActiveList }) => {

  return (
    <div className="courseListContainer">
      <p className="courseTitle">{data?.ChapterTitle}</p>
      <div className="courseSidebarList">
        {data?.IndividualChapter?.map((item) => (
          <div
            className={
              activeList.activeId === item.SubId
                ? "sidebarList active"
                : "sidebarList"
            }
            onClick={() =>
              setActiveList({
                ...activeList,
                activeId: item.SubId,
                activeVideoUrl: item.VideoUrl,
              })
            }
          >
            <p className={item.Finished ? "count checked" : "count"}>
              {item.SubId}
            </p>
            <h2 className="sidebarListName">{item.Title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseListSidebar;
