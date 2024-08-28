import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../app/FirebaseConfiguration/config";
import { putNewDocumentFirestore } from "../Courses/settingNewDataToFireStore";

// const putNewDocumentFirestore = async (data, userId) => {
//   const LikedListArray = [];
//   const StaredListedArray = [];
//   data?.map((item) =>
//     item.Problems.map((item) => {
//       LikedListArray.push({ [item.id]: false });
//       StaredListedArray.push({ [item.id]: false });
//     })
//   );

//   const documentRef = collection(db, "UsersInteraction");
//   let id;
//   if (newUser) {
//     const newDocumentRef = await addDoc(documentRef, { UserId: userId });
//     id = newDocumentRef.id;
//   } else {
//     const q = query(documentRef, where("UserId", "==", userId));
//     const document = await getDocs(q);

//     id = document.docs[0].id;
//   }

//   const subLikedRef = collection(documentRef, id, "PracticeList");

//   await addDoc(subLikedRef, {
//     LikedProblem: LikedListArray,
//     StaredProblem: StaredListedArray,
//   });

//   return [LikedListArray, StaredListedArray];
// };

const setNewLikedAndStaredList = (data) => {
  const LikedListArray = [];
  const StaredListedArray = [];
  data?.map((item) =>
    item.Problems.map((item) => {
      LikedListArray.push({ [item.id]: false });
      StaredListedArray.push({ [item.id]: false });
    })
  );

  return [LikedListArray, StaredListedArray];
};

const modifiedList = (
  data,
  practiceListLikedArray,
  practiceListStaredArray
) => {
 
  const userProblemList = data?.map((item) => ({
    ...item,
    Problems: item.Problems.map((problem) => ({
      ...problem,
      Checked:
        practiceListLikedArray.find((item) =>
          item.hasOwnProperty(problem.id)
        )?.[problem.id] || false,
      Stared:
        practiceListStaredArray.find((item) =>
          item.hasOwnProperty(problem.id)
        )?.[problem.id] || false,
    })),
  }));

  return userProblemList;
};

const handleLocalStorage = (data) => {
  if (localStorage.getItem("practiceList")) {
    const localStorageItem = JSON.parse(localStorage.getItem("practiceList"));
    const practiceListLikedArray = localStorageItem.LikedProblem;
    const practiceListStaredArray = localStorageItem.StaredProblem;
   
    const newList = modifiedList(
      data,
      practiceListLikedArray,
      practiceListStaredArray
    );
    return newList;
  } else {
    const returedValue = setNewLikedAndStaredList(data);
    const LikedListArray = returedValue[0];
    const StaredListedArray = returedValue[1];
    localStorage.setItem(
      "practiceList",
      JSON.stringify({
        LikedProblem: LikedListArray,
        StaredProblem: StaredListedArray,
      })
    );
    const newList = modifiedList(data, LikedListArray, StaredListedArray);
    return newList;
  }
};
const changeLocalStorageData = (id, name) => {
  const localStorageItem = JSON.parse(localStorage.getItem("practiceList"));

  let practiceListLikedArray = localStorageItem.LikedProblem;
  let practiceListStaredArray = localStorageItem.StaredProblem;
 
  if (name === "Checked") {
    const findIndexLike = practiceListLikedArray.findIndex(
      (item) => Object.keys(item)[0] === id
    );
  
    if (findIndexLike == -1 && id) {
      practiceListLikedArray.push({ [id]: true });
    } else {
      const key = Object.keys(practiceListLikedArray[findIndexLike]);
      const newValue = !practiceListLikedArray[findIndexLike][key];
      practiceListLikedArray[findIndexLike][key] = newValue;
    }
  } else if (name === "Stared") {
    const findIndexLike = practiceListLikedArray.findIndex(
      (item) => Object.keys(item)[0] === id
    );
    if (findIndexLike == -1 && id) {
      practiceListStaredArray.push({ [id]: true });
    } else {
      const key = Object.keys(practiceListStaredArray[findIndexLike]);
      const newValue = !practiceListStaredArray[findIndexLike][key];
      practiceListStaredArray[findIndexLike][key] = newValue;
    }
  }
  localStorage.setItem(
    "practiceList",
    JSON.stringify({
      LikedProblem: practiceListLikedArray,
      StaredProblem: practiceListStaredArray,
    })
  );
};
const deleteLocalStorageProgess = () => {
  const localStorageItem = JSON.parse(localStorage.getItem("practiceList"));

  let practiceListLikedArray = localStorageItem.LikedProblem;
  let practiceListStaredArray = localStorageItem.StaredProblem;

  practiceListLikedArray = practiceListLikedArray.map((item) => ({
    [Object.keys(item)]: false,
  }));
  localStorage.setItem(
    "practiceList",
    JSON.stringify({
      LikedProblem: practiceListLikedArray,
      StaredProblem: practiceListStaredArray,
    })
  );
};

export const fetchPractise = createAsyncThunk(
  "Get Practise poblem",
  async (user, { getState, rejectWithValue }) => {
    try {
      const snapShot = await getDocs(collection(db, "topics"));
      const data = snapShot.docs.map((item) => ({
        ID: item.id,
        ...item.data(),
      }));

      const finalData = await Promise.all(
        data.map(async (item) => {
          const subcollectionlist = await getDocs(
            collection(db, "topics", item.ID, "Problems")
          );
          const problem = subcollectionlist.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }));

          return { ...item, Problems: problem };
        })
      );

      return finalData;
    } catch (err) {
      console.log("Error on fetching data", err);
    }
  }
);

export const setUserData = createAsyncThunk(
  "Set user data",
  async (user, { getState, rejectWithValue }) => {
    const state = getState();
    const finalData = state.ProblemsData.ProblemsData;
  
    try {
      if (user && finalData) {
        const ref = collection(db, "UsersInteraction");
        const q = query(ref, where("UserId", "==", user?.uid));
        const userlist = await getDocs(q);

        if (!userlist.empty) {
          const documentId = userlist.docs[0].id;
          
          const practiceRef = collection(
            db,
            "UsersInteraction",
            documentId,
            "PracticeList"
          );
          const practiceList = await getDocs(practiceRef);
          if (!practiceList.empty) {
            const practiceListLikedArray =
              practiceList.docs[0].data().LikedProblem;
            const practiceListStaredArray =
              practiceList.docs[0].data().StaredProblem;

            const userProblemList = modifiedList(
              finalData,
              practiceListLikedArray,
              practiceListStaredArray
            );
            return userProblemList;
          } else {
            const newlyAddedList = await putNewDocumentFirestore(
              user?.uid,
              finalData,
              false,
              "Problem"
            );
            const LikedListArray = newlyAddedList[0];
            const StaredListedArray = newlyAddedList[1];
            const userProblemList = modifiedList(
              finalData,
              LikedListArray,
              StaredListedArray
            );
            return userProblemList;
          }
        } else {
          const newlyAddedList = await putNewDocumentFirestore(
            user?.uid,
            finalData,
            true,
            "Problem"
          );
          const LikedListArray = newlyAddedList[0];
          const StaredListedArray = newlyAddedList[1];
          const userProblemList = modifiedList(
            finalData,
            LikedListArray,
            StaredListedArray
          );
          return userProblemList;
        }
      } else {
        const newList = handleLocalStorage(finalData);
        return newList;
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const changethunk = createAsyncThunk(
  "Modify data",
  async ({ user, name, id }, { getState, rejectWithValue }) => {
    // const state = getState();
    // const data = state.ProblemsData.ProblemsData;
    try {
      if (user) {
        const ref = collection(db, "UsersInteraction");
        const q = query(ref, where("UserId", "==", user?.uid));
        const userlist = await getDocs(q);
        const documentId = userlist.docs[0].id;

        const practiceRef = collection(
          db,
          "UsersInteraction",
          documentId,
          "PracticeList"
        );
        const practiceList = await getDocs(practiceRef);
        const collectionRefId = practiceList.docs[0].id;

        const practiceListLikedArray = practiceList.docs[0].data().LikedProblem;
        const practiceListStaredArray =
          practiceList.docs[0].data().StaredProblem;

        let newValue;
        let updatedArray;
        let documentRef = doc(
          db,
          "UsersInteraction",
          documentId,
          "PracticeList",
          collectionRefId
        );

        if (name === "Checked") {
          const findIndexLike = practiceListLikedArray.findIndex(
            (item) => Object.keys(item)[0] === id
          );
          if (findIndexLike == -1 && id) {
            practiceListLikedArray.push({ [id]: true });
          } else {
            const key = Object.keys(practiceListLikedArray[findIndexLike]);
            newValue = !practiceListLikedArray[findIndexLike][key];
            practiceListLikedArray[findIndexLike][key] = newValue;
          }
          updatedArray = { LikedProblem: practiceListLikedArray };
        } else if (name === "Stared") {
          const findIndexLike = practiceListStaredArray.findIndex(
            (item) => Object.keys(item)[0] === id
          );
          if (findIndexLike == -1 && id) {
            practiceListStaredArray.push({ [id]: true });
          } else {
           
            const key = Object.keys(practiceListStaredArray[findIndexLike]);

            newValue = !practiceListStaredArray[findIndexLike][key];
            practiceListStaredArray[findIndexLike][key] = newValue;
          }
          updatedArray = { StaredProblem: practiceListStaredArray };
         
        }

        await updateDoc(documentRef, updatedArray);
      } else {
        changeLocalStorageData(id, name);
      }
    } catch (er) {
      new Error(er);
      console.log(er);
    }
  }
);

export const deleteThunk = createAsyncThunk(
  "Delte all progress",
  async ({ user }) => {
    if (user) {
      try {
        const ref = collection(db, "UsersInteraction");
        const q = query(ref, where("UserId", "==", user?.uid));
        const userlist = await getDocs(q);
        const documentId = userlist.docs[0].id;
        const practiceRef = collection(
          db,
          "UsersInteraction",
          documentId,
          "PracticeList"
        );

        const practiceList = await getDocs(practiceRef);
        const collectionRefId = practiceList.docs[0].id;
        const practiceListLikedArray = practiceList.docs[0].data().LikedProblem;
        const newArray = practiceListLikedArray.map((item) => {
          const keys = Object.keys(item);
          const newObj = {
            [keys]: false,
          };

          return newObj;
        });

        let newValue;
        let updatedArray;
        let documentRef = doc(
          db,
          "UsersInteraction",
          documentId,
          "PracticeList",
          collectionRefId
        );

        await updateDoc(documentRef, { LikedProblem: newArray });
      } catch (err) {
        console.log(err);
      }
    } else {
      deleteLocalStorageProgess();
    }
  }
);

export const ProblemsDataSlice = createSlice({
  name: "ProblemsDataList",
  initialState: {
    ProblemsData: [],
    Status: "",
    Error: null,
  },
  reducers: {
    setData(state, action) {
      state.ProblemsData = action.payload;
    },
    toggleData: {
      reducer(state, action) {
        const { id, name } = action.payload;
        const updatedState = state.ProblemsData.map((topic) => ({
          ...topic,
          Problems: topic.Problems.map((problem) =>
            problem.id === id ? { ...problem, [name]: !problem[name] } : problem
          ),
        }));
       
        state.ProblemsData = updatedState;
       
      },
      prepare(name, id) {
        return {
          payload: {
            name,
            id,
          },
        };
      },
    },
    deleteData(state, action) {
      state.ProblemsData = state.ProblemsData.map((topic) => ({
        ...topic,
        Problems: topic.Problems.map((problem) => ({
          ...problem,
          Checked: false,
        })),
      }));
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPractise.pending, (state, action) => {
        state.Status = "Loading";
      })
      .addCase(fetchPractise.fulfilled, (state, action) => {
        state.Status = "Success";
        state.Error = null;
        state.ProblemsData = action.payload;
      })
      .addCase(fetchPractise.rejected, (state, action) => {
        state.Status = "Failed";
        state.Error = "Please Realod the Page";
      })
      .addCase(setUserData.fulfilled, (state, action) => {
        state.Status = "Fetched Data Successfully";
        state.ProblemsData = action.payload;
      
      })
      .addCase(setUserData.rejected, (state, action) => {
       
      });
  },
});

export const selectAllProblemsData = (state) => state.ProblemsData.ProblemsData;
export const { resetAll, setData, toggleData, deleteData } =
  ProblemsDataSlice.actions;
export default ProblemsDataSlice.reducer;
export const getStatus = (state) => state.ProblemsData.Status;
export const getError = (state) => state.ProblemsData.Error;
