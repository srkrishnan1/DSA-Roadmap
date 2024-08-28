import "./App.css";
import { Route, Routes, useRouteError } from "react-router-dom";
import Practise from "./Pages/Practise";
import Lessons from "./Pages/Lessons";
import Courses from "./Pages/Courses";
import Layout from "./Layout/Layout";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./app/FirebaseConfiguration/config";
import {
  fetchPractise,
  setUserData,
  getStatus,
  selectAllProblemsData,
} from "./features/Data/ProblemsDataSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourseListThunk,
  getCourseStatus,
  SelectAllcourse,
  setCourseDataThunk,
} from "./features/Courses/CoursesList";

function App() {
  const [user] = useAuthState(auth);
  const dispatch = useDispatch();
  const practiseStatus = useSelector(getStatus);
  const courseStatus = useSelector(getCourseStatus);
  const practisedata = useSelector(selectAllProblemsData);
  const courseData = useSelector(SelectAllcourse);
  const SettingFunction = async () => {
    await dispatch(fetchPractise());
    await dispatch(fetchCourseListThunk());

    // if (courseStatus == "Success") await dispatch(setCourseDataThunk(user));
  };
  useEffect(() => {
    dispatch(fetchPractise());
    dispatch(fetchCourseListThunk());
  }, [user]);

  useEffect(() => {
    if (practiseStatus == "Success") {
      dispatch(setUserData(user));
    }
  }, [practiseStatus, user]);

  useEffect(() => {
    if (
      courseStatus == "Success" &&
      practiseStatus == "Fetched Data Successfully"
    ) {
      

      dispatch(setCourseDataThunk(user));
    }
  }, [courseStatus, practiseStatus, user]);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Practise />} />
        <Route path="/lessons" element={<Lessons />}>
          <Route path=":courseId" element={<Courses />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
