import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    topic: "Array and Hashing",
    group: 1,
    problems: [
      {
        id: 1,
        checked: true,
        stared: false,
        problemName: "Contains Duplicate",
        difficulty: "Easy",
        video: "https://www.youtube.com/embed/B0_M1y4aFAQ?si=umOL17Ou2dv2ih-t",
        article: true,
        problemId: 1,
      },
      {
        id: 2,
        checked: true,
        stared: false,
        problemName: "Two Sum",
        difficulty: "Medium",
        video: "http://youtube.com",
        article: true,
        problemId: 1,
      },
    ],
  },
  {
    topic: "Bit Manipulation",
    group: 2,
    problems: [
      {
        id: 3,
        checked: false,
        stared: true,
        problemName: "Two Sum",
        difficulty: "Medium",
        video: "",

        article: false,
        problemId: 1,
      },
    ],
  },
  {
    topic: "Recursion",
    group: 2,
    problems: [
      {
        id: 4,
        checked: true,
        stared: false,
        problemName: "Longest Subsequency",
        difficulty: "Easy",
        video: "http://youtube.com/2",
        article: true,
        problemId: 1,
      },
      {
        id: 5,
        checked: true,
        stared: false,
        problemName: "Longest common subsequence",
        difficulty: "Hard",
        video: "http://youtube.com/5",
        article: true,
        problemId: 2,
      },
    ],
  },
  {
    topic: "Dynamic Programming",
    group: 3,
    problems: [
      {
        id: 6,
        checked: true,
        stared: false,
        problemName: "Longest Subsequency",
        difficulty: "Easy",
        video: "http://youtube.com/2",
        article: true,
        problemId: 1,
      },
      {
        id: 7,
        checked: true,
        stared: false,
        problemName: "Longest common subsequence",
        difficulty: "Hard",
        video: "http://youtube.com/5",
        article: true,
        problemId: 2,
      },
    ],
  },
  {
    topic: "Stacks and Ques",
    group: 3,
    problems: [
      {
        id: 8,
        checked: true,
        stared: false,
        problemName: "Longest Subsequency",
        difficulty: "Easy",
        video: "http://youtube.com/2",
        article: true,
        problemId: 1,
      },
      {
        id: 9,
        checked: true,
        stared: false,
        problemName: "Longest common subsequence",
        difficulty: "Hard",
        video: "http://youtube.com/5",
        article: true,
        problemId: 2,
      },
    ],
  },
  {
    topic: "Binary Trees",
    group: 3,
    problems: [
      {
        id: 10,
        checked: true,
        stared: false,
        problemName: "Longest Subsequency",
        difficulty: "Easy",
        video: "http://youtube.com/2",
        article: true,
        problemId: 1,
      },
      {
        id: 11,
        checked: true,
        stared: false,
        problemName: "Longest common subsequence",
        difficulty: "Hard",
        video: "http://youtube.com/5",
        article: true,
        problemId: 2,
      },
    ],
  },
];

export const ProblemsDataSlice = createSlice({
  name: "ProblemsData",
  initialState,
  reducers: {
    changeStatus: {
      reducer(state, action) {
        return state.map((item) => {
          const updatedProblems = item.problems.map((problem) =>
            problem.id === action.payload.id
              ? {
                  ...problem,
                  [action.payload.name]: !problem[action.payload.name],
                }
              : problem
          );
          return { ...item, problems: updatedProblems };
        });
      },
      prepare(id, name) {
        return {
          payload: {
            id,
            name,
          },
        };
      },
    },
    resetAll: (state, action) => {
      return state.map((item) => ({
        ...item,
        problems: item.problems.map((problem) => ({
          ...problem,
          checked: false,
        })),
      }));
    },
  },
});

export const selectAllProblemsData = (state) => state.ProblemsData;
export const { changeStatus, resetAll } = ProblemsDataSlice.actions;
export default ProblemsDataSlice.reducer;
