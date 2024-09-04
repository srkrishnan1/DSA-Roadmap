import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../app/FirebaseConfiguration/config";
import { putNewDocumentFirestore } from "./settingNewDataToFireStore";

const modifyData = (data, userCourListDetails) => {
  // Create a copy of the data to modify
  console.log(userCourListDetails);
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
                // Determine if the current individual chapter has been finished
                const isFinished = userCourListDetails?.some(
                  (item) =>
                    item.CourseId == course.CourseId &&
                    item.FinishedProblem?.includes(indi.SubId)
                );

                // Return the individual chapter with the new 'Finished' field
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

  // Return the modified data

  return modifiedData;
};

const toggleDataInLocalStorage = (id, courseId) => {
  try {
    const courseListArray = JSON.parse(localStorage.getItem("CourseList"));
    const courseIndex = courseListArray.findIndex(
      (c) => c.CourseId === Number(courseId)
    );

    if (courseIndex !== -1) {
      const course = courseListArray[courseIndex];
      const FinishedProblem = course.FinishedProblem || [];

      // Check if the value is in the FinishedProblem array
      const valueIndex = FinishedProblem.indexOf(Number(id));

      if (valueIndex !== -1) {
        // If the value exists, remove it
        FinishedProblem.splice(valueIndex, 1);
      } else {
        // If the value doesn't exist, add it
        FinishedProblem.push(id);
      }

      // Update the specific course object in the Courses array
      courseListArray[courseIndex].FinishedProblem = FinishedProblem;

      // Reference to the document that needs to be updated
      //
      localStorage.setItem("CourseList", JSON.stringify(courseListArray));
    }
  } catch (er) {
    console.log(er);
  }
};

export const toggleFinishedProblem = createAsyncThunk(
  "Toggled finished Problem",
  async ({ id, courseId, user }, { getState, rejectWithValue }) => {
    const state = getState();
    const ProblemsData = state.CourseList.CourseListArray;
    if (user) {
      try {
        const ref = collection(db, "UsersInteraction");

        // Query to find the document with the specific UserId
        const q = query(ref, where("UserId", "==", user?.uid));
        const userlist = await getDocs(q);

        // Get the document ID of the user's document
        const documentId = userlist.docs[0].id;

        // Reference to the CourseList subcollection
        const courseListRef = collection(
          db,
          "UsersInteraction",
          documentId,
          "CourseList"
        );

        // Query all documents in CourseList (assuming you want to search all courses)
        const querySnapshot = await getDocs(courseListRef);

        querySnapshot.forEach(async (docSnapshot) => {
          const data = docSnapshot.data();

          if (data.Courses) {
            // Find the course object that matches the courseId
            const courseIndex = data.Courses.findIndex(
              (c) => c.CourseId === Number(courseId)
            );
            let FinishedProblem;

            if (courseIndex !== -1) {
              const course = data.Courses[courseIndex];
              FinishedProblem = course.FinishedProblem || [];

              // Check if the value is in the FinishedProblem array
              const valueIndex = FinishedProblem.indexOf(Number(id));

              if (valueIndex !== -1) {
                // If the value exists, remove it
                FinishedProblem.splice(valueIndex, 1);
              } else {
                // If the value doesn't exist, add it
                FinishedProblem.push(id);
              }
              data.Courses[courseIndex].FinishedProblem = FinishedProblem;
            } else {
              data.Courses.push({
                CourseId: Number(courseId),
                FinishedProblem: [id],
              });
            }

            const courseDocRef = doc(courseListRef, docSnapshot.id);

            // Update the document in Firestore
            console.log(data);
            await updateDoc(courseDocRef, {
              Courses: data.Courses,
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      toggleDataInLocalStorage(id, courseId);
    }
  }
);
const handleLocalStorage = (data) => {
  let newData;
  if (!localStorage.getItem("CourseList")) {
    const temp = [];
    data.map((item) =>
      item.CourseList.map((item) =>
        temp.push({
          CourseId: item.CourseId,
          FinishedProblem: [],
        })
      )
    );

    newData = temp;

    localStorage.setItem("CourseList", JSON.stringify(temp));
  } else {
    const localStorageItem = JSON.parse(localStorage.getItem("CourseList"));
    newData = localStorageItem;
  }
  const modifiedData = modifyData(data, newData);

  return modifiedData;
};

export const fetchCourseListThunk = createAsyncThunk(
  "Get Course Details",
  async () => {
    const snapShot = await getDocs(collection(db, "CourseSection"));
    const data = snapShot.docs.map((item) => ({
      ID: item.id,
      ...item.data(),
    }));
    console.log(data);
    return data;
  }
);

export const setCourseDataThunk = createAsyncThunk(
  "Set data based on User",
  async (user, { getState, rejectWithValue }) => {
    const state = getState();
    const data = state.CourseList.CourseListArray;

    try {
      if (user) {
        const ref = collection(db, "UsersInteraction");
        const q = query(ref, where("UserId", "==", user?.uid));
        const userlist = await getDocs(q);

        if (!userlist.empty) {
          const documentId = userlist.docs[0].id;

          const practiceRef = collection(
            db,
            "UsersInteraction",
            documentId,
            "CourseList"
          );

          const courseList = await getDocs(practiceRef);
          if (!courseList.empty) {
            const courseListDetails = courseList.docs[0].data().Courses;

            const newArray = modifyData(data, courseListDetails);
            console.log(newArray);
            return newArray;
          } else {
            const finishedProblem = await putNewDocumentFirestore(
              user?.uid,
              data,
              false,
              "Course"
            );

            const newArray = modifyData(data, finishedProblem);
            console.log(newArray);
            return newArray;
          }
        } else {
          const finishedProblem = await putNewDocumentFirestore(
            user?.uid,
            data,
            true,
            "Course"
          );

          const newArray = modifyData(data, finishedProblem);
          console.log(newArray);
          return newArray;
        }
      } else {
        //setting data in local storage
        const modifiedData = handleLocalStorage(data);

        return modifiedData;
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const CourseListSlice = createSlice({
  name: "CourseList",
  initialState: { CourseListArray: [], Status: "", Error: null },
  reducers: {
    setCourseData(state, action) {
      state.CourseListArray = action.payload;
    },
    toggleCourseData: {
      reducer(state, action) {
        const data = state.CourseListArray;

        const { courseId, subid } = action.payload;

        const finaldata = data?.map((datum) => {
          return {
            ...datum,
            CourseList: datum.CourseList?.map((course) => {
              // Check if courseId matches
              if (course.CourseId === courseId) {
                return {
                  ...course,
                  Chapter: course.Chapter?.map((chapter) => {
                    return {
                      ...chapter,
                      IndividualChapter: chapter.IndividualChapter.map(
                        (indi) => {
                          // Check if both subId and courseId match
                          let isFinished = indi.Finished;
                          if (indi.SubId === subid) {
                            isFinished = !indi.Finished;
                          }
                          return {
                            ...indi,
                            Finished: isFinished,
                          };
                        }
                      ),
                    };
                  }),
                };
              }
              // If courseId doesn't match, return the course as is
              return course;
            }),
          };
        });

        state.CourseListArray = finaldata;
      },
      prepare(courseId, id) {
        return {
          payload: {
            courseId: Number(courseId),
            subid: Number(id),
          },
        };
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCourseListThunk.pending, (state, action) => {
        state.Status = "Loading";
      })
      .addCase(fetchCourseListThunk.fulfilled, (state, action) => {
        state.Status = "Success";
        state.Error = null;

        state.CourseListArray = action.payload;
      })
      .addCase(fetchCourseListThunk.rejected, (state, action) => {
        state.Status = "Failed";
        state.Error = "Please Reload the Page";

        state.CourseListArray = action.payload;
      })
      .addCase(setCourseDataThunk.fulfilled, (state, action) => {
        state.CourseListArray = action.payload;
      })
      .addCase(setCourseDataThunk.rejected, (state, action) => {
        state.Error = "Please reload the page";
      });
  },
});
export const SelectCourse = (state, courseName) => {
  for (const course of state.CourseList?.CourseListArray) {
    const matchingSubsection = course.CourseList.find(
      (item) => item.CourseId === Number(courseName)
    );

    if (matchingSubsection) {
      return matchingSubsection;
    }
  }

  return null;
};
export const SelectAllcourse = (state) => state.CourseList.CourseListArray;
export default CourseListSlice.reducer;
export const { setCourseData, toggleCourseData } = CourseListSlice.actions;
export const getCourseStatus = (state) => state.CourseList.Status;
export const getCourseError = (state) => state.CourseList.Error;
