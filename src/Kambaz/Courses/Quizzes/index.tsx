import { ListGroup, Nav } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import QuizControl from "./QuizControl";
import { useParams } from "react-router";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteQuiz, setQuizzes, updateQuiz } from "./reducer";
import * as coursesClient from "../client"
import { LuNotebookText } from "react-icons/lu";
import QuizControlButtons from "./QuizControlButtons";
import * as quizClient from "./client";
import * as userClient from "../../Account/client";

const formatDate = (date: Date) => {
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();

  let hours = date.getHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${month} ${day} at ${hours}:${minutes}${ampm}`;
};


export default function Quizzes() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [ attempts, setAttempts ] = useState<any[]>([]);

  const fetchQuizzes = async () => {
    if (!cid) return;
    const updatedQuizzes =
      await coursesClient.findQuizzesForCourse(cid);
    dispatch(setQuizzes(updatedQuizzes));
  };

  const deleteQuizHandler = async (quizID: string) => {
    try {
      await quizClient.deleteQuiz(quizID);
      dispatch(deleteQuiz(quizID));
    } catch (error) {
      console.error(error);
    }
  };

  const updateQuizPublished = async (quizID: string, published: boolean) => {
    const curQuiz = quizzes.find((q: any) => q._id === quizID);
    if (!curQuiz) return;
    const updatedQuiz = {
      ...curQuiz, published: published
    }
    await quizClient.updateQuiz(updatedQuiz);
    dispatch(updateQuiz(updatedQuiz));
  };

  useEffect(() => {
    fetchQuizzes();
    fetchUserAttempts();
  }, []);

  const fetchUserAttempts = async () => {
    const attempts = await userClient.findAttemptsForUser(currentUser._id);
    attempts.sort((a: any, b: any) => {
      const aDate = new Date(a.attemptEndTime);
      const bDate = new Date(b.attemptEndTime);
      if (aDate < bDate) {
        return -1;
      } else if (aDate > bDate) {
        return 1;
      } else {
        return 0;
      }
    });
    setAttempts(attempts);
  };

  const calculateAttemptScore = (attempt: any) => {
    const questions = attempt.originalQuestions;
    const answers = attempt.answers;
    var score = 0;
    questions.map((q: any) => {
      if (answers.some((a: any) => {
        if (a.questionID !== q._id) return false;
        if (q.type === "MULTIPLE") {
          return q.multipleAnswerID === a.multipleAnswerID;
        } else if (q.type === "TRUEFALSE") {
          return q.boolAnswer === a.boolAnswer;
        } else if (q.type === "FILLBLANK") {
          const blanks = q.fillBlanks;
          return !blanks.some((blank: any) => {
            const userResponse = a.fillAnswers.find((ans: any) => ans.blankId === blank._id);
            if (!userResponse) return true;
            const blankAnswers = blank.answers.map((b: any) => b.toLowerCase())
            return !blankAnswers.includes(userResponse.fillAnswer.toLowerCase())
          })
        }
        return false;
      })) score += q.points;
    });
    return score;
  };

  return (
    <div id="wd-quizzes">
      <QuizControl />
      <ListGroup className="rounded-0" id="wd-modules">
        <ListGroup.Item className="wd-module p-0 mb-5 sf-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />QUIZZES
            <div className="float-end">
              <GreenCheckmark />
              <BsPlus />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
          <ListGroup className="wd-lessons rounded-0">
            {quizzes.filter((quiz: any) => quiz.course === cid)
              .filter((quiz: any) => currentUser.role !== "STUDENT" || quiz.published)
              .sort((a: any, b: any) => {
                const da = new Date(a.from).getTime();
                const db = new Date(b.from).getTime();
                return da - db;
              })
              .map((quiz: any) => {
                if (currentUser.role === "STUDENT" && !quiz.published) return;
                const dueDate = new Date(quiz.due);
                const fromDate = new Date(quiz.from);
                const untilDate = new Date(quiz.until);
                const curDate = new Date();

                const available = curDate >= fromDate && curDate < untilDate;
                const points = quiz.questions.reduce(
                  (total: number, question: any) => total + (question.points || 0)
                  , 0) || 0

                const curAttempts = attempts.filter((a: any) => a.quizID === quiz._id);
                const attemptCnt = curAttempts.length;
                return (
                  <ListGroup.Item className="wd-lesson d-flex justify-content-between align-items-center p-3 ps-1">
                    <div className="d-flex align-items-center">
                      <BsGripVertical className="me-2 fs-3" />
                      <LuNotebookText color="green" className="me-2 fs-3" />
                      <div>
                        <Nav.Link href={`#/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
                          className="wd-assignment-link fw-bold">{quiz.title}</Nav.Link>
                        {
                          available ? <span className="fw-bold">Available</span>
                            : (curDate < untilDate ? <span className="fw-bold"> Not available until {formatDate(fromDate)} </span> : <span className="fw-bold">Closed</span>)
                        }
                        {!isNaN(dueDate.getTime()) && (<> | <span className="fw-bold"> Due </span> {formatDate(dueDate)} | </>)}
                        {points} pts | {quiz.questions.length} questions
                        {
                          (curAttempts.length > 0) && 
                          <> | Last score: {calculateAttemptScore(curAttempts[attemptCnt - 1])}/{points}</>
                        }
                      </div>
                    </div>
                    <div>
                      {
                        <QuizControlButtons quiz={quiz} deleteQuiz={deleteQuizHandler} setQuizPublished={updateQuizPublished} />
                      }
                    </div>
                  </ListGroup.Item>
                );
              })}
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
