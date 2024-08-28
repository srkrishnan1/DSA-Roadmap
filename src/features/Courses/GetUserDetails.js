import { auth, db } from "../../app/FirebaseConfiguration/config";
import {
  doc,
  collection,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { selectAllProblemsData, setData } from "../Data/ProblemsDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { useUserDocumentId } from "../Data/useUserDocumentId";
import { useAuthState } from "react-firebase-hooks/auth";

export const useChangeStauts = () => {
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);

  const data = useSelector(selectAllProblemsData);
  const changeStatus = async ({ id, name }) => {
    const ref = collection(db, "UsersInteraction");
    const q = query(ref, where("UserId", "==", user?.uid));
    const userlist = await getDocs(q);
    const documentId = userlist.docs[0].id;
    const updatedState = data.map((topic) => ({
      ...topic,
      Problems: topic.Problems.map((problem) =>
        problem.id === id ? { ...problem, [name]: !problem[name] } : problem
      ),
    }));
    dispatch(setData(updatedState));
    if (user) {
      await updateFireStoreUserInteraction(id, name, documentId);
    } else {
      changeLocalStorageData(id, name);
    }
  };
  return changeStatus;
};

const updateFireStoreUserInteraction = async (id, name, documentId) => {
  try {
    const practiceRef = collection(
      db,
      "UsersInteraction",
      documentId,
      "PracticeList"
    );
    const practiceList = await getDocs(practiceRef);
    const collectionRefId = practiceList.docs[0].id;

    const practiceListLikedArray = practiceList.docs[0].data().LikedProblem;
    const practiceListStaredArray = practiceList.docs[0].data().StaredProblem;

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
  } catch (er) {
    console.log(er);
  }
};

export const useDeleteAllProgress = () => {
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);
  const data = useSelector(selectAllProblemsData);
  const deleteAllProgress = async () => {
    const updatedState = data.map((topic) => ({
      ...topic,
      Problems: topic.Problems.map((problem) => ({
        ...problem,
        Checked: false,
      })),
    }));
    dispatch(setData(updatedState));
    if (user) {
      //await updateFireStoreUserInteraction();
      deleteAllProgressInFirestore(documentId);
    } else {
      deleteLocalStorageProgess();
    }
  };
  return deleteAllProgress;
};

const deleteAllProgressInFirestore = async (documentId) => {
  try {
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
  } catch (er) {
    console.log(er);
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
