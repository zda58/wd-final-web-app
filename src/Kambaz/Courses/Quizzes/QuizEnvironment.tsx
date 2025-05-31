import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import QuizResults from "./QuizResults";
import QuizTaker from "./QuizTaker";
import * as coursesClient from "../client"
import { setQuizzes } from "./reducer";
import * as quizzesClient from "./client"

export default function QuizEnvironment() {
  const { cid, qid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const navigate = useNavigate();
  const [allAttempts, setAllAttempts] = useState<any[]>([]);

  const [answers, setAnswers] = useState<any[]>([]);
  const [lastAttempt, setLastAttempt] = useState<any>();

  const quiz = quizzes.find((q: any) => q._id === qid);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [fetched, setFetched] = useState(false);
  const [validTake, setValidTake] = useState(false);

  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
  }, []);

  const saveRecentAttemptHandler = async (attempt: any) => {
    setLastAttempt(attempt);
    if (currentUser.role === "FACULTY") return;
    await quizzesClient.recordUserAttempt(attempt);
  };

  const fetchQuizAttempts = async () => {
    const attempts = await quizzesClient.fetchQuizAttempts(qid || "", currentUser._id);
    setAllAttempts(attempts);
    setFetched(true);
  };

  useEffect(() => {
    if (currentUser.role === "FACULTY") return;
    fetchQuizAttempts();
  }, [qid, currentUser]);

  useEffect(() => {
    if (currentUser.role === "FACULTY") return;
    if (!quiz) return;
    if (!quiz.multipleAttempts) {
      if (allAttempts.length > 0) {
        alert(`You have already taken this quiz.`);
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
        return;
      } else {
        setValidTake(true);
      }
    } else {
      if (allAttempts.length >= quiz.attempts) {
        alert(`You have already taken this quiz ${quiz.attempts} times`);
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
        return;
      } else {
        setValidTake(true);
      }
    }
  }, [allAttempts]);

  const setAnswerHandler = (qid: string, ans: any) => {
    if (!quiz) return;
    const question = quiz.questions.find((q: any) => q._id === qid);
    if (!question) return;
    const prevAnswer = answers.find((a: any) => a.questionID === qid);
    if (question.type === "MULTIPLE") {
      const newAnswer = { questionID: qid, multipleAnswerID: ans as string };
      if (prevAnswer) {
        const updatedAnswers = answers.map((a: any) =>
          a.questionID === qid ? newAnswer : a);
        setAnswers(updatedAnswers);
      } else {
        setAnswers([...answers, newAnswer]);
      }
    } else if (question.type === "TRUEFALSE") {
      const newAnswer = { questionID: qid, boolAnswer: ans as boolean };
      if (prevAnswer) {
        const updatedAnswers = answers.map((a: any) =>
          a.questionID === qid ? newAnswer : a);
        setAnswers(updatedAnswers);
      } else {
        setAnswers([...answers, newAnswer]);
      }
    } else if (question.type === "FILLBLANK") {
      const newAnswer = { questionID: qid, fillAnswer: ans as string };
      if (prevAnswer) {
        const updatedAnswers = answers.map((a: any) =>
          a.questionID === qid ? newAnswer : a);
        setAnswers(updatedAnswers);
      } else {
        setAnswers([...answers, newAnswer]);
      }
    }
  };

  const finishQuizHandler = (endTime: Date) => {
    if (!startTime) {
      alert("Invalid start time");
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
      return;
    }
    if (!quiz) return;
    const startTimeString = startTime.toISOString().split('.')[0] + "+00:00";
    const endTimeString = endTime.toISOString().split('.')[0] + "+00:00";
    const finishedAttempt = {
      quizID: qid,
      userID: currentUser._id,
      attemptStartTime: startTimeString,
      attemptEndTime: endTimeString,
      originalQuestions: quiz.questions,
      answers: answers,
    };
    setLastAttempt(finishedAttempt);
    saveRecentAttemptHandler(finishedAttempt);
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/take/results`);
  };

  return (
    <>
      {fetched && validTake &&
        (<Routes>
          <Route index element={<Navigate to="question/0" replace />} />
          <Route path="question/:questionNum" element={
            <QuizTaker
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
        </Routes>)
      }
    </>
  );
}