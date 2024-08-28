// import {
//   addDoc,
//   collection,
//   doc,
//   getDocs,
//   query,
//   setDoc,
//   where,
// } from "firebase/firestore";
// import { auth, db } from "../../app/FirebaseConfiguration/config";
// import { useEffect, useReducer, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import { setData } from "./ProblemsDataSlice";
// import { useAuthState } from "react-firebase-hooks/auth";

// export const useFetchData = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [user] = useAuthState(auth);
//   const ref = useRef(false);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (ref.current === true) {
//       const fetchData = async () => {
//         setLoading(true);
//         setError("");

//         try {
//           const snapShot = await getDocs(collection(db, "topics"));
//           const data = snapShot.docs.map((item) => ({
//             ID: item.id,
//             ...item.data(),
//           }));

//           const finalData = await Promise.all(
//             data.map(async (item) => {
//               const subcollectionlist = await getDocs(
//                 collection(db, "topics", item.ID, "Problems")
//               );
//               const problem = subcollectionlist.docs.map((item) => ({
//                 id: item.id,
//                 ...item.data(),
//               }));

//               return { ...item, Problems: problem };
//             })
//           );

//           if (user && finalData) {
//             const ref = collection(db, "UsersInteraction");
//             const q = query(ref, where("UserId", "==", user?.uid));
//             const userlist = await getDocs(q);

//             if (!userlist.empty) {
//               const documentId = userlist.docs[0].id;
//               console.log("document is there so no need");
//               const practiceRef = collection(
//                 db,
//                 "UsersInteraction",
//                 documentId,
//                 "PracticeList"
//               );
//               const practiceList = await getDocs(practiceRef);
//               if (!practiceList.empty) {
//                 const practiceListLikedArray =
//                   practiceList.docs[0].data().LikedProblem;
//                 const practiceListStaredArray =
//                   practiceList.docs[0].data().StaredProblem;

//                 const userProblemList = modifiedList(
//                   finalData,
//                   practiceListLikedArray,
//                   practiceListStaredArray
//                 );

//                 dispatch(setData(userProblemList));
//               } else {
//                 const newlist = setNewUserDocInFirestore(
//                   finalData,
//                   user?.uid,
//                   false
//                 );
//                 dispatch(setData(newlist));
//               }
//             } else {
//               const newlyAddedList = await setNewUserDocInFirestore(
//                 finalData,
//                 user?.uid,
//                 true
//               );
//               const LikedListArray = newlyAddedList[0];
//               const StaredListedArray = newlyAddedList[1];
//               const userProblemList = modifiedList(
//                 finalData,
//                 LikedListArray,
//                 StaredListedArray
//               );
//               dispatch(setData(userProblemList));
//             }
//           } else {
//             const newList = handleLocalStorage(finalData);
//             dispatch(setData(newList));
//           }
//         } catch (err) {
//           setError("Can't fetch data");
//           console.error(err);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchData();
//     }

//     return () => (ref.current = true);
//   }, [user, dispatch]);

//   return { loading, error };
// };

// const handleLocalStorage = (data) => {
//   if (localStorage.getItem("practiceList")) {
//     const localStorageItem = JSON.parse(localStorage.getItem("practiceList"));
//     const practiceListLikedArray = localStorageItem.LikedProblem;
//     const practiceListStaredArray = localStorageItem.StaredProblem;
//     console.log(practiceListLikedArray, practiceListStaredArray);
//     const newList = modifiedList(
//       data,
//       practiceListLikedArray,
//       practiceListStaredArray
//     );
//     return newList;
//   } else {
//     const returedValue = setNewLikedAndStaredList(data);
//     const LikedListArray = returedValue[0];
//     const StaredListedArray = returedValue[1];
//     localStorage.setItem(
//       "practiceList",
//       JSON.stringify({
//         LikedProblem: LikedListArray,
//         StaredProblem: StaredListedArray,
//       })
//     );
//     const newList = modifiedList(data, LikedListArray, StaredListedArray);
//     return newList;
//   }
// };

// const modifiedList = (
//   data,
//   practiceListLikedArray,
//   practiceListStaredArray
// ) => {
//   const userProblemList = data?.map((item) => ({
//     ...item,
//     Problems: item.Problems.map((problem) => ({
//       ...problem,
//       Checked:
//         practiceListLikedArray.find((item) =>
//           item.hasOwnProperty(problem.id)
//         )?.[problem.id] || false,
//       Stared:
//         practiceListStaredArray.find((item) =>
//           item.hasOwnProperty(problem.id)
//         )?.[problem.id] || false,
//     })),
//   }));

//   return userProblemList;
// };

// const setNewLikedAndStaredList = (data) => {
//   const LikedListArray = [];
//   const StaredListedArray = [];
//   data?.map((item) =>
//     item.Problems.map((item) => {
//       LikedListArray.push({ [item.id]: false });
//       StaredListedArray.push({ [item.id]: false });
//     })
//   );

//   return [LikedListArray, StaredListedArray];
// };

// const setNewUserDocInFirestore = async (data, userId, newUser) => {
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
