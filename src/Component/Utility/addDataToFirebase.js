import { db } from "../../app/FirebaseConfiguration/config";
let problemid=3;
function Structure(problmename, diff, video, exstlink) {
  return {
    Article: true,
    ProblemName: problmename,
    ProblemId: problemid++,
    Difficulty: diff,
    Video: video,
    ProblemExternalLink: exstlink,
  };
}

const array =[
    ["Time complexity", "Easy", "https://www.youtube.com/embed/FPu9Uld7W-E?si=WIJtyoSAw_H61_vI", ""],
    ["Patterns", "Easy", "https://www.youtube.com/embed/tNm_NNSB3_w?si=EWDrZ3Eq_51x-Aus","" ],
    ["Count Digits", "Easy", "https://www.youtube.com/embed/1xNbjMdbjug?si=RJqGugeXgYwzTO1F","https://www.geeksforgeeks.org/problems/count-digits5716/1"],
    
]