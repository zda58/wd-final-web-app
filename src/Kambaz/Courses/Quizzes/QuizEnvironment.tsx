import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import QuizResults from "./QuizResults";
import QuizTaker from "./QuizTaker";
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
    fetchQuizAttempts();
  }, [qid, currentUser]);

  useEffect(() => {
    if (!quiz) return;
    if (currentUser.role === "FACULTY") {
      setValidTake(true);
      return;
    }
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
  }, [allAttempts, currentUser]);

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
      //-- receive: questionId, and blank/answer combo
      // need to keep all prevAnswer values, and update singular blank
          //-- if there is no prevAnswer, make a new one with singular ans in fillAnswers
          // otherwise, copy prevAnswer. if needed blankID is in fillAnswers, go thru update
          // if needed blankId not in fillAnswers, add it
      // then do setAnswers with updated or push as necessary
      if (prevAnswer) {
        // check if prevAnswer has value for given blankId
        const prevBlankValue = prevAnswer.fillAnswers.find((a: any) => a.blankId === ans.blankId)
        if (prevBlankValue) {
          // if blank has a prev value, replace it with new "ans"
          const newFillAnswers = prevAnswer.fillAnswers.map((a: any) => 
            a.blankId === ans.blankId ? ans : a)
          // update answer with updated fillAnswers array 
          const updatedAnswers = answers.map((a: any) => 
            a.questionID === qid ? {questionID: qid, fillAnswers: newFillAnswers} : a)
          // update hook
          setAnswers(updatedAnswers);
        } else {
          // if blank has no prev value, create new Answer with the new blank value
          const newAnswer = {questionID: qid, fillAnswers: [...prevAnswer.fillAnswers, ans]}
          // update answers array with new Answer
          const updatedAnswers = answers.map((a: any) =>
            a.questionID === qid ? newAnswer : a)
          // update hook
          setAnswers(updatedAnswers);
        }
      } else {
        const newAnswer = { questionID: qid, fillAnswers: [ans] };
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