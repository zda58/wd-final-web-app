import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as client from "./client"
import QuizResults from "./QuizResults";

export default function QuizResultsPage() {
  const { qid, aid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((q: any) => q._id === qid);
  const [attempt, setAttempt] = useState(undefined);
  const fetchQuizAttempts = async () => {
    if (!qid) return;
    const attempts = await client.fetchQuizAttempts(qid, currentUser._id);
    const foundAttempt = attempts.find((a: any) => a._id === aid);
    if (!foundAttempt) return;
    setAttempt(foundAttempt);
  };
  useEffect(() => {
    fetchQuizAttempts();
  }, []);

  return (
    <QuizResults attempt={attempt} quiz={quiz} />
  );
}