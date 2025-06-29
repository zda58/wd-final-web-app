import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  quizzes: [],
  attempts: [],
};
const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, { payload: quizzes }) => {
      state.quizzes = quizzes;
    },
    addQuiz: (state, { payload: quiz }) => {
      state.quizzes = [...state.quizzes, quiz] as any;
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q: any) =>
        q._id === quiz._id ? quiz : q
      ) as any;
    },
    deleteQuiz: (state, { payload: quizID }) => {
      state.quizzes = state.quizzes.filter(
        (q: any) => q._id !== quizID);
    },
    /*
    deleteAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.filter(
        (a: any) => a._id !== assignmentId);
    },
    updateAssignment: (state, { payload: assignment }) => {
      state.assignments = state.assignments.map((a: any) =>
        a._id === assignment._id ? assignment : a
      ) as any;
    },
    */
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuiz } =
  quizzesSlice.actions;
export default quizzesSlice.reducer;