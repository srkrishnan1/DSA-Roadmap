const setNewUserDocInFirestore = async (data, userId) => {
   
    const LikedListArray = [];
    const StaredListedArray = [];
    data?.map((item) =>
      item.Problems.map((item) => {
        LikedListArray.push({ [item.id]: false });
        StaredListedArray.push({ [item.id]: false });
      })
    );
  
    const documentRef = collection(db, "UsersInteraction");
   
    const newDocumentRef = await addDoc(documentRef, { UserId: userId });
  
 
    const subLikedRef = collection(
      documentRef,
      newDocumentRef.id,
      "PracticeList"
    );
  
    await addDoc(subLikedRef, {
      LikedProblem: LikedListArray,
      StaredProblem: StaredListedArray,
    });
  
    return [LikedListArray, StaredListedArray];
  };