import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { SelectAllcourse, setCourseData } from "./CoursesList";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../../app/FirebaseConfiguration/config";
import { useEffect } from "react";

export const useToggleFinished = (courseId, subid) => {
  
    const toggleFinished = async () => {
      const modifiedData = data?.map((datum) => {
        return {
          ...datum,
          CourseList: datum.CourseList?.map((course) => {
            return {
              ...course,
              Chapter: course.Chapter?.map((chapter) => {
                return {
                  ...chapter,
                  IndividualChapter: chapter.IndividualChapter.map((indi) => {

                    let isFinished;
                    if (indi.SubId === subid) {
                      isFinished = !indi.Finished;
                    }
                  
                    return {
                      ...indi,
                      Finished: isFinished,
                    };
                  }),
                };
              }),
            };
          }),
        };
      });

   
  }
}


