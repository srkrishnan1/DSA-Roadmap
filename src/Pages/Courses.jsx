import { useParams } from "react-router";
import SideBar from "../Component/SideBar/SideBar";
import CourseListSidebar from "../Component/Utility/CourseListSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  SelectCourse,
  toggleCourseData,
  toggleFinishedProblem,
} from "../features/Courses/CoursesList";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../app/FirebaseConfiguration/config";

const Courses = () => {
  const { courseId } = useParams();
  const [user] = useAuthState(auth);
  const ref = useRef(true);

  const [activeList, setActiveList] = useState({
    activeVideoUrl: "",
    activeId: 1,
    isPrevAvailable: false,
    isNextAvailable: true,
  });

  const courseList = useSelector((state) => SelectCourse(state, courseId));
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      courseList &&
      courseList?.Chapter.length > 0 &&
      courseList?.Chapter[0]?.IndividualChapter?.length > 0
    ) {
      if (ref.current === true) {
        const firstChapter = courseList.Chapter[0];
        const firstSubsection = firstChapter.IndividualChapter[0];

        setActiveList((prevState) => ({
          ...prevState,
          activeVideoUrl: firstSubsection.VideoUrl,
          activeId: firstSubsection.SubId,
        }));
        return () => (ref.current = false);
      }
    }
  }, [courseList]);

  // Update activeList state based on activeId and courseList changes
  useEffect(() => {
    if (!courseList) return;

    const allSubIds = courseList.Chapter.flatMap((section) =>
      section.IndividualChapter?.map((sub) => sub.SubId)
    );

    const isFirstSub = activeList.activeId === Math.min(...allSubIds);
    const isLastSub = activeList.activeId === Math.max(...allSubIds);

    const currentChecked = courseList.Chapter.some((section) =>
      section.IndividualChapter?.some(
        (sub) => sub.SubId === activeList.activeId && sub.Finished
      )
    );

    setActiveList((prevState) => ({
      ...prevState,
      isPrevAvailable: !isFirstSub,
      isNextAvailable: !isLastSub,
      isChecked: currentChecked,
    }));
  }, [activeList.activeId, courseList]);

  const handlePrev = () => {
    const currentSection = courseList.Chapter.find((item) =>
      item.IndividualChapter.some(
        (section) => section.SubId === activeList.activeId
      )
    );
    const currentSubSectionIndex = currentSection.IndividualChapter.findIndex(
      (item) => item.SubId === activeList.activeId
    );
    if (currentSubSectionIndex > 0) {
      const newActiveId =
        currentSection.IndividualChapter[currentSubSectionIndex - 1].SubId;
      const newActiveVideoUrl =
        currentSection.IndividualChapter[currentSubSectionIndex - 1].VideoUrl;
      setActiveList((prevState) => ({
        ...prevState,
        activeVideoUrl: newActiveVideoUrl,
        activeId: newActiveId,
      }));
    } else {
      const currentSectionIndex = courseList.Chapter.findIndex(
        (item) => item.ChapterId === currentSection.ChapterId
      );
      if (currentSectionIndex > 0) {
        const prevSection = courseList.Chapter[currentSectionIndex - 1];
        const prevSubSecction =
          prevSection.IndividualChapter[
            prevSection.IndividualChapter.length - 1
          ];
        setActiveList((prevState) => ({
          ...prevState,
          activeVideoUrl: prevSubSecction.VideoUrl,
          activeId: prevSubSecction.SubId,
        }));
      }
    }
  };
  const handleNext = () => {
    const currentSection = courseList.Chapter.find((item) =>
      item.IndividualChapter.some(
        (section) => section.SubId === activeList.activeId
      )
    );
   
    const currentSubSectionIndex = currentSection.IndividualChapter.findIndex(
      (item) => item.SubId === activeList.activeId
    );

    if (currentSubSectionIndex < currentSection.IndividualChapter.length - 1) {
      const newActiveId =
        currentSection.IndividualChapter[currentSubSectionIndex + 1].SubId;
      const newActiveVideoUrl =
        currentSection.IndividualChapter[currentSubSectionIndex + 1].VideoUrl;
      setActiveList((prevState) => ({
        ...prevState,
        activeVideoUrl: newActiveVideoUrl,
        activeId: newActiveId,
      }));
    } else {
      const currentSectionIndex = courseList.Chapter.findIndex(
        (item) => item.ChapterId === currentSection.ChapterId
      );
     
      if (currentSectionIndex < courseList.Chapter.length - 1) {
        const prevSection = courseList.Chapter[currentSectionIndex + 1];
        const prevSubSecction = prevSection.IndividualChapter[0];
        setActiveList((prevState) => ({
          ...prevState,
          activeVideoUrl: prevSubSecction.VideoUrl,
          activeId: prevSubSecction.SubId,
        }));
      }
    }
  };

  const sidebarData = (
    <div className="sideBarListCourses">
      {courseList?.Chapter?.map((item) => (
        <CourseListSidebar
          data={item}
          activeList={activeList}
          setActiveList={setActiveList}
        />
      ))}
    </div>
  );
  const handleToggle = (id) => {
    dispatch(toggleFinishedProblem({ id, courseId, user }));
    dispatch(toggleCourseData(courseId, id));
  };
  let total = 0;
  let finished = 0;
  courseList?.Chapter?.forEach((item) =>
    item?.IndividualChapter?.forEach((item) => {
      if (item.Finished) finished++;
      total++;
    })
  );

  let percentage = finished == 0 ? 0 : (finished / total) * 100;
  const header = (
    <div className="coursesHeader">
      <div className="sideBarTitle">{courseList?.CourseTitle}</div>
      <div className="outerProgressBar">
        <div className="progressBar" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="coursesPage">
      <SideBar heading={header} children={sidebarData} giveWidth="360px" classname="courseSidebar"/>
      <div className="coursesVideoGroup">
        <p className="title">Arrays</p>
        <div className="coursesVideoContainer">
          <iframe
            width="560"
            height="315"
            src={activeList.activeVideoUrl || ""}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            className="courseVideoIframe"
            allowfullscreen
          ></iframe>
        </div>
        <div className="courseStatus">
          <div className="courseCheckbox">
            <input
              type="checkbox"
              id="courseCompleted"
              className="checkboxCourse"
              checked={activeList.isChecked}
              onClick={(e) => {
                e.preventDefault();
                handleToggle(activeList.activeId);
              }}
            />
            <label htmlFor="courseCompleted">Mark as Completed</label>
          </div>

          <div className="btnGroup">
            <button
              disabled={activeList.isPrevAvailable ? false : true}
              className={
                activeList.isPrevAvailable
                  ? "navigateBtns btnactive"
                  : "navigateBtns navBtndisabled"
              }
              onClick={handlePrev}
            >
              Prev
            </button>
            <button
              disabled={activeList.isNextAvailable ? false : true}
              className={
                activeList.isNextAvailable
                  ? "navigateBtns btnactive"
                  : "navigateBtns navBtndisabled"
              }
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
