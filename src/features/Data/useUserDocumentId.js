import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../app/FirebaseConfiguration/config";
import {
  collection,
  query,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";

export const useUserDocumentId = () => {
  const [documentId, setDocumentId] = useState();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ref = useRef(false);
  const userId = user?.uid;


  useEffect(() => {
    if (!user) return;
    if (ref.current === true) {
      const ref = collection(db, "UsersInteraction");
      const q = query(ref, where("UserId", "==", userId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const ID = snapshot.docs[0].id;
          setDocumentId(ID);
         
        } else {
          setDocumentId(null);
        }
        setLoading(false);
      })((error) => {
        setError("Can't able to fetch user data");
        console.log(error);
      });
    

      return () => unsubscribe();
    }
    return () => (ref.current = true);
  }, [user, documentId]);

  return [documentId, userId, loading, error];
};
