import { useDispatch, useSelector } from "react-redux";
import PlaylistContainer from "../Component/Utility/PlaylistContainer";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import {
  getCourseError,
  getCourseStatus,
  SelectAllcourse,
} from "../features/Courses/CoursesList";
import Loader from "../Component/Utility/Loader";

const Lessons = () => {
  const location = useLocation();
  const data = useSelector(SelectAllcourse);
  // const dispatch = useDispatch();

  const status = useSelector(getCourseStatus);
  const error = useSelector(getCourseError);
  return (
    <>
      {location.pathname == "/lessons" ? (
        <div className="playlistContainerGroup">
          {status == "Loading" && <Loader />}
          {error && <p className="errorPara">Please Reload the Page</p>}
          {data?.map((item) => (
            <PlaylistContainer
              heading={item.SectionTitle}
              description={item.Description}
              children={item.CourseList}
            />
          ))}
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Lessons;
