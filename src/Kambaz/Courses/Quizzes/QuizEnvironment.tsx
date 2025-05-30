import { useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate, useParams } from "react-router";
import QuizResults from "./QuizResults";
import QuizTaker from "./QuizTaker";

export default function QuizEnvironment() {
  const { cid, qid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const navigate = useNavigate();
  
  const [answers, setAnswers] = useState<any[]>([]);
  const [lastAttempt, setLastAttempt] = useState();

  const quiz = quizzes.find((q: any) => q._id === qid);

  const fetchQuizAttempts = () => {

  };

  const saveRecentAttemptHandler = (attempt: any) => {
    setLastAttempt(attempt);
    if (currentUser.role !== "FACULTY") {

    }
  };

  const setAnswerHandler = (qid: string, ans: any) => {

  };

  const finishQuizHandler = () => {
    navigate("results");
  };

  return (
    <Routes>
      <Route path="/" element={
        <QuizTaker 
          quiz={quiz}
          answers={answers}
          setAnswerHandler={setAnswerHandler}
          finishQuizHandler={finishQuizHandler}
        />
      } />
      <Route path="results" element={
        <QuizResults 
          attempt={lastAttempt}
          quiz={quiz}
        />
      } />
    </Routes>
  );
}