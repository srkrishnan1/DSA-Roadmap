import {
  addDoc,
  collection,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../../app/FirebaseConfiguration/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { SelectAllcourse, setCourseData } from "./CoursesList";
import { selectAllProblemsData } from "../Data/ProblemsDataSlice";



let problemSlice = false;
let courseSlice = false;
let problemSliceArg = null;
let courseSliceArg = null;

export const putNewDocumentFirestore = async (
  userId,
  data,
  newuser,
  nameOfSlice
) => {
  if (nameOfSlice == "Problem") {
    problemSlice = true;
  

    return await setNewUserDocInFirestore(userId, data, newuser);
  }
  if (nameOfSlice == "Course" && problemSlice) {
    courseSlice = true;


    return await putNewDocumentInFireStore(userId, data, newuser);
  }
};

export const putNewDocumentInFireStore = async (userId, data, newuser) => {
  const FinishedProblem = [];
 

  let documentId;
  const documentRef = collection(db, "UsersInteraction");
  if (newuser) {
    const newDocumentRef = await addDoc(documentRef, { UserId: userId });
    documentId = newDocumentRef.id;
  } else {
    const q = query(documentRef, where("UserId", "==", userId));
    const document = await getDocs(q);

    documentId = document.docs[0].id;
  }

  const subLikedRef = collection(documentRef, documentId, "CourseList");
  let temp = [];
  data.map((item) =>
    item.CourseList.map((item) =>
      temp.push({
        CourseId: item.CourseId,
        FinishedProblem: [],
      })
    )
  );

  await addDoc(subLikedRef, { Courses: temp });

  return temp;
};



export const setNewUserDocInFirestore = async (userId, data, newuser) => {
 

  const LikedListArray = [];
  const StaredListedArray = [];

  data?.map((item) =>
    item.Problems.map((item) => {
      LikedListArray.push({ [item.id]: false });
      StaredListedArray.push({ [item.id]: false });
    })
  );

  const documentRef = collection(db, "UsersInteraction");
  let id;
  if (newuser) {
    const newDocumentRef = await addDoc(documentRef, { UserId: userId });
    id = newDocumentRef.id;
   
  } else {
    const q = query(documentRef, where("UserId", "==", userId));
    const document = await getDocs(q);

    id = document.docs[0].id;
    
  }

  const subLikedRef = collection(documentRef, id, "PracticeList");

  await addDoc(subLikedRef, {
    LikedProblem: LikedListArray,
    StaredProblem: StaredListedArray,
  });

  return [LikedListArray, StaredListedArray];
};
